import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

interface Event {
  id: string;
  date: string;
  title: string;
  color: string;
  rotation: number;
}

// Get all events
app.get('/make-server-9829a803/events', async (c) => {
  try {
    const events = await kv.getByPrefix<Event>('event:');
    return c.json({ events: events || [] });
  } catch (error) {
    console.log('Error fetching events:', error);
    return c.json({ error: 'Failed to fetch events', details: error.message }, 500);
  }
});

// Add event
app.post('/make-server-9829a803/events', async (c) => {
  try {
    const body = await c.req.json();
    const { date, title, color, rotation } = body;
    
    if (!date || !title) {
      return c.json({ error: 'Date and title are required' }, 400);
    }
    
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const event: Event = {
      id,
      date,
      title,
      color,
      rotation,
    };
    
    await kv.set(`event:${id}`, event);
    return c.json({ event });
  } catch (error) {
    console.log('Error creating event:', error);
    return c.json({ error: 'Failed to create event', details: error.message }, 500);
  }
});

// Delete event
app.delete('/make-server-9829a803/events/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`event:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting event:', error);
    return c.json({ error: 'Failed to delete event', details: error.message }, 500);
  }
});

// Update event
app.put('/make-server-9829a803/events/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { date, title, color, rotation } = body;
    
    const event: Event = {
      id,
      date,
      title,
      color,
      rotation,
    };
    
    await kv.set(`event:${id}`, event);
    return c.json({ event });
  } catch (error) {
    console.log('Error updating event:', error);
    return c.json({ error: 'Failed to update event', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);