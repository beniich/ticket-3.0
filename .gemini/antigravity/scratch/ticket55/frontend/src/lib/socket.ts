import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (this.socket) return this.socket;

        const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        this.socket = io(URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
        });

        return this.socket;
    }

    on(event: string, callback: (...args: any[]) => void) {
        if (!this.socket) this.connect();
        this.socket?.on(event, callback);
    }

    off(event: string, callback: (...args: any[]) => void) {
        this.socket?.off(event, callback);
    }

    emit(event: string, data: any) {
        if (!this.socket) this.connect();
        this.socket?.emit(event, data);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

const socketService = new SocketService();
export default socketService;
