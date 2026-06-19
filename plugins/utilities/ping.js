import os from "os";

export default {
  name: "ping",
  aliases: ["uptime"],
  category: "utilitários",
  description: "Verificar latência de resposta.",
  owner: false,
  group: false,
  private: false,
  admin: false,
  botAdmin: false,
  isQuery: false,
  disabled: false,
  cooldown: 20000,

  run: async ({ ctx, conn }) => {
    const netStart = Date.now();

    await fetch("https://1.1.1.1/cdn-cgi/trace", {
      method: "HEAD",
      cache: "no-store",
    });

    const netLatency = Date.now() - netStart;

    function getSystemCpuLoad() {
      const cpus = os.cpus();

      let idle = 0;
      let total = 0;

      for (const cpu of cpus) {
        for (const type in cpu.times) {
          total += cpu.times[type];
        }
        idle += cpu.times.idle;
      }

      return ((1 - idle / total) * 100).toFixed(2);
    }

    const systemCpu = getSystemCpuLoad();
    const status = netLatency < 200 ? "Excelente" : netLatency < 500 ? "Boa" : netLatency < 1000 ? "Média" : "Alta";

    const uptime = process.uptime();
    const formatUptime = (s) => {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = Math.floor(s % 60);
      return `${h}h ${m}m ${sec}s`;
    };

    const formatMem = (bytes) => {
      const mb = bytes / 1024 / 1024;
      if (mb >= 1024) {
        return `${(mb / 1024).toFixed(2)}GB`;
      }
      return `${mb.toFixed(2)}MB`;
    };

    const senderDevice = ctx.getDevice(ctx.messageId);
    const quotedDevice = ctx.quotedId ? ctx.getDevice(ctx.quotedId) : null;
    const totalMemSys = os.totalmem();
    const freeMemSys = os.freemem();
    const usedMemSys = totalMemSys - freeMemSys;
    const usedSysFmt = formatMem(usedMemSys);
    const totalSysFmt = formatMem(totalMemSys);
    const ramSysPercent = ((usedMemSys / totalMemSys) * 100).toFixed(1);

    let text =
      `> Informações do sistema:\n\n` +
      `*≡ Latência*: ${netLatency} ms (${status})\n` +
      `*• Tempo de atividade*: ${formatUptime(uptime)}\n` +
      `*• Node.js*: ${process.version}\n` +
      `*• Plataforma*: ${process.platform}\n\n` +
      `*≡ CPU (sistema)*: ${systemCpu}%\n` +
      `*• RAM (sistema)*: ${usedSysFmt}/${totalSysFmt} (${ramSysPercent}%)`;

    if (senderDevice) {
      text += `\n*• Dispositivo do remetente*: ${senderDevice}`;
    }

    if (quotedDevice) {
      text += `\n*• Dispositivo citado*: ${quotedDevice}`;
    }

    await conn.sendReply(text);
  }
};