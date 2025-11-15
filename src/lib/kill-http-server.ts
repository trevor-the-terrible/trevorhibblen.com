import { exec } from 'child_process';

const killProcessByName = async (processName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Different commands for Windows vs Unix-like systems
    const cmd = process.platform === 'win32'
      ? `taskkill /F /IM ${processName}`
      : `pkill -f ${processName}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        // Don't reject if process not found, as that's an acceptable state
        if (error.code === 128 || error.code === 1) {
          resolve();
          return;
        }
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export default killProcessByName;

killProcessByName('http-server');
