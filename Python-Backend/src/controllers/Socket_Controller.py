
import socketio

connections = {}
messages = {}

def register_socket_events(sio):
    @sio.event
    async def connect(sid, environ):
        print(f"Client connected: {sid}")

    @sio.event
    async def disconnect(sid):
        print(f"Client disconnected: {sid}")
        # Find which room the user was in
        for room, clients in list(connections.items()):
            if sid in clients:
                # Notify others in the room
                for client_id in clients:
                    if client_id != sid:
                        await sio.emit('user-left', sid, room=client_id)
                
                # Remove user from room
                connections[room].remove(sid)
                if not connections[room]:
                    del connections[room]
                break

    @sio.on('join-call')
    async def handle_join_call(sid, path):
        if path not in connections:
            connections[path] = set() # Use set to avoid duplicates
        
        connections[path].add(sid)
        
        # Notify others in the room
        for client_id in connections[path]:
            await sio.emit('user-joined', (sid, list(connections[path])), room=client_id)
        
        # Send chat history to new user
        if path in messages:
            for msg in messages[path]:
                await sio.emit('chat-message', (msg['data'], msg['sender'], msg['socket-id-sender']), room=sid)

    @sio.on('signal')
    async def handle_signal(sid, toId, message):
        await sio.emit('signal', (sid, message), room=toId)

    @sio.on('chat-message')
    async def handle_chat_message(sid, data, sender):
        # Find the room match
        matching_room = None
        for room, clients in connections.items():
            if sid in clients:
                matching_room = room
                break
        
        if matching_room:
            if matching_room not in messages:
                messages[matching_room] = []
            
            messages[matching_room].append({
                'sender': sender,
                'data': data,
                'socket-id-sender': sid
            })
            
            # Broadcast to everyone in the room using room argument
            # We use the path/room name as the room ID
            for client_id in connections[matching_room]:
                await sio.emit('chat-message', (data, sender, sid), room=client_id)
