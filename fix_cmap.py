from fontTools.ttLib import TTFont

font = TTFont("assets/fonts/reve.ttf")
cmap = font["cmap"]

for table in cmap.tables:
    if table.language != 0:
        print(f"Fixing cmap subtable platformID={table.platformID} platEncID={table.platEncID} language={table.language}")
        table.language = 0

font.save("assets/fonts/reve.ttf")
print("Saved fixed font.")
