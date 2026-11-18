#!/usr/bin/env node

const { execSync } = require('child_process');
const { Command } = require('commander');
const program = new Command();

program
  .name('portsniffer')
  .description('A lightning-fast CLI tool to find and terminate processes squatting on local ports.')
  .version('1.0.0');

const getPidByPort = (port) => {
  try {
    if (process.platform === 'win32') {
      const stdout = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const lines = stdout.trim().split(/\r?\n/);
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const address = parts[1];
        if (address && address.endsWith(`:${port}`)) {
          return parts[parts.length - 1];
        }
      }
    } else {
      const stdout = execSync(`lsof -t -i:${port}`, { encoding: 'utf8' });
      const pid = stdout.trim().split(/\r?\n/)[0];
      if (pid) return pid;
    }
  } catch (err) {
    // Return null if no process found
  }
  return null;
};

program
  .command('find')
  .description('Check which process is running on a specific port')
  .argument('<port>', 'Port number to check (e.g., 3000)')
  .action((port) => {
    console.log(`\nSniffing port ${port}...`);
    const pid = getPidByPort(port);

    if (!pid) {
      console.log(`Success: Port ${port} is currently free.`);
    } else {
      console.log(`⚠️ Port ${port} is occupied by Process ID (PID): ${pid}`);
    }
  });

program
  .command('kill')
  .description('Terminate the process occupying a specific port')
  .argument('<port>', 'Port number to clear (e.g., 3000)')
  .action((port) => {
    console.log(`\nScanning port ${port} for termination...`);
    const pid = getPidByPort(port);

    if (!pid) {
      console.log(`Success: Port ${port} is already free. No process to kill.`);
      return;
    }

    console.log(`Found process PID ${pid} on port ${port}. Terminating...`);

    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /F /PID ${pid}`);
      } else {
        execSync(`kill -9 ${pid}`);
      }
      console.log(`Successfully freed port ${port} by terminating PID ${pid}.`);
    } catch (err) {
      console.error(`Error: Failed to terminate process PID ${pid}. Try running terminal as Administrator.`);
      process.exit(1);
    }
  });

program.parse();