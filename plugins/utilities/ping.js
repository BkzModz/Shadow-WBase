import os from "os";

export default {
  name: "ping",
  aliases: ["uptime", "status"],
  category: "utilitários",
  description: "Verificar latência e informações completas do sistema.",
  owner: false,
  group: false,
  private: false,
  admin: false,
  botAdmin: false,
  isQuery: false,
  disabled: false,
  cooldown: 5000,

  run: async ({ ctx, conn }) => {
    const netStart = Date.now();

    try {
      await fetch("https://1.1.1.1/cdn-cgi/trace", {
        method: "HEAD",
        cache: "no-store",
      });
    } catch {
    }

    const netLatency = Date.now() - netStart;

    const cpus = os.cpus();
    const loadAvg = os.loadavg();

    let systemCpu = 0;
    if (loadAvg[0] > 0) {
      systemCpu = Math.min(((loadAvg[0] / cpus.length) * 100), 100).toFixed(2);
    } else {
      const cpuUsage = process.cpuUsage();
      const totalUsage = (cpuUsage.user + cpuUsage.system) / 1000;
      systemCpu = Math.min((totalUsage / (process.uptime() * 1000)) * 100, 100).toFixed(2);
    }

    const status =
      netLatency < 200 ? "Excelente" :
        netLatency < 500 ? "Boa" :
          netLatency < 1000 ? "Média" : "Alta";

    const formatUptime = (s) => {
      const d = Math.floor(s / (3600 * 24));
      const h = Math.floor((s % (3600 * 24)) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = Math.floor(s % 60);

      let res = "";
      if (d > 0) res += `${d}d `;
      if (h > 0 || d > 0) res += `${h}h `;
      res += `${m}m ${sec}s`;
      return res;
    };

    const formatMem = (bytes) => {
      const mb = bytes / 1024 / 1024;
      if (mb >= 1024) {
        return `${(mb / 1024).toFixed(2)} GB`;
      }
      return `${mb.toFixed(2)} MB`;
    };

    const senderDevice = ctx.getDevice ? ctx.getDevice(ctx.messageId) : null;
    const quotedDevice = ctx.quotedId && ctx.getDevice ? ctx.getDevice(ctx.quotedId) : null;

    const totalMemSys = os.totalmem();
    const freeMemSys = os.freemem();
    const usedMemSys = totalMemSys - freeMemSys;
    const ramSysPercent = ((usedMemSys / totalMemSys) * 100).toFixed(1);

    const memoryUsage = process.memoryUsage();
    const botRss = formatMem(memoryUsage.rss);
    const botHeap = formatMem(memoryUsage.heapUsed);

    let text =
      `> *Painel de Status & Sistema*\n` +
      `*• Latência*: ${netLatency} ms (${status})\n` +
      `*• Uptime (Bot)*: ${formatUptime(process.uptime())}\n` +
      `*• Uptime (OS)*: ${formatUptime(os.uptime())}\n\n` +
      `> *Hardware / OS*\n` +
      `*• Uso da CPU*: ${systemCpu}%\n` +
      `*• RAM (Sistema)*: ${formatMem(usedMemSys)} / ${formatMem(totalMemSys)} (${ramSysPercent}%)\n` +
      `*• Plataforma*: ${process.platform} (${os.arch})\n\n` +
      `> *Desempenho do Bot*\n` +
      `*• RAM (RSS)*: ${botRss}\n` +
      `*• Heap (JS)*: ${botHeap}\n` +
      `*• Node.js*: ${process.version}\n` +
      `*• PID*: ${process.pid}`;

    if (senderDevice) {
      text += `\n\n> *Dispositivo do remetente*: ${senderDevice}`;
    }

    if (quotedDevice) {
      text += `\n> *Dispositivo citado*: ${quotedDevice}`;
    }

    await conn.sendReply(text);
  }
};