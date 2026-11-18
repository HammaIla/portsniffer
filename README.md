# PortSniffer

PortSniffer is a lightning-fast, cross-platform command-line utility built in Node.js designed to locate and terminate rogue processes occupying local network ports (solving EADDRINUSE friction instantly).

## Features

- **Cross-Platform Support:** Seamlessly inspects and terminates processes on Windows (
etstat/	askkill) and Unix/macOS (lsof/kill).
- **Granular Commands:** Check port status with ind <port> or instantly free up resources with kill <port>.
- **Zero Heavy Dependencies:** Built on native Node.js process management and commander.

## Installation

Clone the repository and link it globally for local terminal access:

\\\ash
git clone https://github.com/HammaIla/portsniffer.git
cd portsniffer
npm install
npm link
\\\

## Usage

Check which process is occupying a port:

\\\ash
portsniffer find 3000
\\\

Terminate the process occupying a port:

\\\ash
portsniffer kill 3000
\\\

## License

MIT License. See [LICENSE](LICENSE) for details.