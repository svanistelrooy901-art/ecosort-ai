"""Optional local native build helper; never deploys or makes AI calls.
Uses the configured system HTTP(S) proxy for Java as needed. Run only with a
properly installed SDK and Gradle. EAS remains the preferred owner build path.
"""
import os
import subprocess
from urllib.parse import urlparse
from pathlib import Path

proxy = urlparse(os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy') or '')
env = os.environ.copy()
options = env.get('JAVA_TOOL_OPTIONS', '')
if proxy.hostname:
    options += f' -Dhttps.proxyHost={proxy.hostname} -Dhttps.proxyPort={proxy.port or 80}'
    options += f' -Dhttp.proxyHost={proxy.hostname} -Dhttp.proxyPort={proxy.port or 80}'
env['JAVA_TOOL_OPTIONS'] = options.strip()
gradle = os.environ.get('ECOSORT_GRADLE', './gradlew')
raise SystemExit(subprocess.call([gradle, '--no-daemon', ':app:assembleRelease', '-PreactNativeArchitectures=arm64-v8a', '--max-workers=2', '--info'], cwd=Path(__file__).resolve().parents[1] / 'android', env=env))
