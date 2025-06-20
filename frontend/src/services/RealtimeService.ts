import { Post, Comment } from "../types/post";

// Event types for realtime updates
export enum RealtimeEventType {
  POST_LIKED = 'post.liked',
  POST_BOOKMARKED = 'post.bookmarked',
  COMMENT_ADDED = 'comment.added',
  COMMENT_UPDATED = 'comment.updated',
  COMMENT_DELETED = 'comment.deleted',
  COMMENT_LIKED = 'comment.liked',
}

// Interface for realtime event data
interface RealtimeEvent {
  type: RealtimeEventType;
  data: any;
}

// Interface for event listeners
type EventListener = (data: any) => void;

/**
 * Service for handling realtime updates
 */
export class RealtimeService {
  private static instance: RealtimeService;
  private websocket: WebSocket | null = null;
  private eventListeners: Map<RealtimeEventType, EventListener[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  
  // Singleton pattern - private constructor
  private constructor() {}
  
  /**
   * Get the singleton instance of RealtimeService
   */
  public static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }
  
  /**
   * Initialize WebSocket connection
   */  public connect(): void {
    // Close existing connection if any
    if (this.websocket) {
      this.websocket.close();
    }
      const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('Cannot initialize WebSocket: No authentication token found');
      return;
    }
    
    console.log('Initializing WebSocket with token:', token.substring(0, 10) + '...');
    
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.NODE_ENV === 'production' 
      ? `${wsProtocol}//${window.location.host}/ws` 
      : `${wsProtocol}//${window.location.hostname}:8000/ws`;
      
    const wsUrl = `${wsHost}?token=${token}`;
    console.log('Connecting to WebSocket URL:', wsUrl.replace(token, token.substring(0, 10) + '...'));
    
    try {
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('WebSocket connection established successfully');
        this.reconnectAttempts = 0;
      };
      
      this.websocket.onmessage = (event) => {
        try {
          const eventData: RealtimeEvent = JSON.parse(event.data);
          console.log('WebSocket received event:', eventData.type);
          this.handleEvent(eventData);
        } catch (error) {
          console.error('Error parsing WebSocket message', error);
        }
      };
      
      this.websocket.onclose = (event) => {
        console.log('WebSocket connection closed with code:', event.code);
        if (event.code !== 1000) { // Not a normal closure
          this.handleReconnect();
        }
      };
      
      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection', error);
    }
  }
  
  /**
   * Handle WebSocket reconnection
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect WebSocket in ${delay/1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Maximum WebSocket reconnection attempts reached');
    }
  }
  
  /**
   * Subscribe to a specific event type
   * @param eventType - The type of event to listen for
   * @param callback - The function to call when the event occurs
   */
  public subscribe(eventType: RealtimeEventType, callback: EventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    
    const listeners = this.eventListeners.get(eventType)!;
    if (!listeners.includes(callback)) {
      listeners.push(callback);
    }
  }
  
  /**
   * Unsubscribe from a specific event type
   * @param eventType - The type of event to stop listening for
   * @param callback - The function to remove from the listeners
   */
  public unsubscribe(eventType: RealtimeEventType, callback: EventListener): void {
    if (this.eventListeners.has(eventType)) {
      const listeners = this.eventListeners.get(eventType)!;
      const index = listeners.indexOf(callback);
      
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  /**
   * Handle incoming events
   * @param event - The event object received from the WebSocket
   */
  private handleEvent(event: RealtimeEvent): void {
    const { type, data } = event;
    
    if (this.eventListeners.has(type)) {
      const listeners = this.eventListeners.get(type)!;
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${type}:`, error);
        }
      });
    }
  }
  
  /**
   * Close the WebSocket connection
   */
  public disconnect(): void {
    if (this.websocket) {
      this.websocket.close(1000, 'User logged out');
      this.websocket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.eventListeners.clear();
  }
}

export default RealtimeService;
