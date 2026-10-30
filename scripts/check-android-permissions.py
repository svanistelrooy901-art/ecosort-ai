"""Assert usable camera permission in a generated manifest or the packaged APK."""
import argparse
from pathlib import Path
import re
import subprocess
import xml.etree.ElementTree as ET

ANDROID = '{http://schemas.android.com/apk/res/android}'
TOOLS = '{http://schemas.android.com/tools}'
CAMERA = 'android.permission.CAMERA'
MICROPHONE = 'android.permission.RECORD_AUDIO'


def check_manifest(path):
    permissions = ET.parse(path).getroot().findall('uses-permission')
    camera = [p for p in permissions if p.get(ANDROID + 'name') == CAMERA]
    if not camera or any(p.get(TOOLS + 'node') == 'remove' or p.get(ANDROID + 'maxSdkVersion') for p in camera):
        raise ValueError('CAMERA permission is missing, blocked or limited in the generated manifest')
    if any(p.get(ANDROID + 'name') == MICROPHONE and p.get(TOOLS + 'node') != 'remove' for p in permissions):
        raise ValueError('Unexpected microphone permission in a photo-only app')
    print('PASS: generated manifest permits Camera and blocks microphone access')


def check_apk(path, aapt):
    result = subprocess.run([aapt, 'dump', 'permissions', str(path)], check=True, capture_output=True, text=True)
    permissions = set(re.findall(r"uses-permission(?:-sdk-23)?: name='([^']+)'", result.stdout))
    if CAMERA not in permissions:
        raise ValueError('The packaged APK does not declare CAMERA permission')
    if MICROPHONE in permissions:
        raise ValueError('The packaged APK unexpectedly requests microphone permission')
    print('PASS: packaged APK declares Camera without microphone access')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--manifest', type=Path)
    group.add_argument('--apk', type=Path)
    parser.add_argument('--aapt', default='aapt')
    args = parser.parse_args()
    try:
        if args.manifest:
            check_manifest(args.manifest)
        else:
            check_apk(args.apk, args.aapt)
    except (ValueError, subprocess.CalledProcessError, OSError, ET.ParseError) as error:
        parser.exit(1, 'FAIL: ' + str(error) + '\n')
