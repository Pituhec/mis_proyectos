import Pusher from "pusher";

let _pusher: Pusher | null = null;

function getPusher(): Pusher {
  if (!_pusher) {
    _pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return _pusher;
}

export async function emitir(canal: string, evento: string, datos: object) {
  try {
    await getPusher().trigger(canal, evento, datos);
  } catch (err) {
    console.error(`[pusher] Error en ${canal}/${evento}:`, err);
  }
}
