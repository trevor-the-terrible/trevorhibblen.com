const runE2e = async (): Promise<number> => {
  const build = Bun.spawn(["bun", "run", "build"], {
    stderr: "inherit",
    stdout: "inherit",
  });
  const buildExitCode = await build.exited;

  if (buildExitCode !== 0) {
    return buildExitCode;
  }

  const server = Bun.spawn(
    ["./node_modules/.bin/http-server", "dist", "-p", "4321", "-c-1"],
    {
      stderr: "inherit",
      stdout: "inherit",
    },
  );

  try {
    let serverReady = false;

    for (let attempt = 0; attempt < 150; attempt += 1) {
      if (server.exitCode !== null) {
        throw new Error(
          `Preview server exited with code ${server.exitCode} before becoming ready.`,
        );
      }

      try {
        const response = await fetch("http://127.0.0.1:4321");
        await response.body?.cancel();

        if (response.ok) {
          serverReady = true;
          break;
        }
      } catch {
        await Bun.sleep(100);
      }
    }

    if (!serverReady) {
      throw new Error("Preview server did not become ready within 15 seconds.");
    }

    const forwardedArgs = Bun.argv.slice(2);
    const command = ["bun", "run", "e2e"];

    if (forwardedArgs.length > 0) {
      command.push("--", ...forwardedArgs);
    }

    const cypress = Bun.spawn(command, {
      stderr: "inherit",
      stdout: "inherit",
    });

    return await cypress.exited;
  } finally {
    if (server.exitCode === null) {
      server.kill();
    }
    await server.exited;
  }
};

try {
  process.exitCode = await runE2e();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
