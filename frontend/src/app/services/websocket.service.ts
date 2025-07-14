import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { TeamScore } from '../models/types';

interface WebSocketMessage {
  type: 'initial' | 'update';
  data: TeamScore[];
  teamId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private scoreUpdate$ = new Subject<TeamScore[]>();
  private connected$ = new Subject<boolean>();

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = `ws://${window.location.hostname}:3001`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.connected$.next(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.scoreUpdate$.next(message.data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.connected$.next(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  getScoreUpdates(): Observable<TeamScore[]> {
    return this.scoreUpdate$.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}