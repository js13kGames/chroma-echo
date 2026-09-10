from pathlib import Path
import zipfile, shutil
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"src"/"submission.html"; dist=ROOT/"dist"; dist.mkdir(exist_ok=True)
out=dist/"index.html"; shutil.copy2(src,out)
archive=dist/"chroma-echo.zip"
with zipfile.ZipFile(archive,"w",zipfile.ZIP_DEFLATED,compresslevel=9) as z:z.write(out,"index.html")
size=archive.stat().st_size
print(f"Built {archive} — {size} bytes ({size/1024:.2f} KiB)")
if size>13*1024: raise SystemExit("FAIL: submission exceeds 13 KiB")
print("PASS: under the 13 KiB limit")
