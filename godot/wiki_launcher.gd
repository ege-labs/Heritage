extends Node
## Heritage Wiki'yi oyundan açar (ÖRNEK — eklenti gerektirmez, sistem tarayıcısını kullanır).
## Kullanım: bu betiği bir autoload ya da düğüme ekle, `WikiLauncher.open("economy")` çağır.
## Wiki dosyalarını projene `res://wiki/` olarak kopyala (Strategy-web klasörünün içeriği).
## Dışa aktarma filtresine ekle: *.html, *.js, *.css, *.json, *.png, *.svg, *.ttf
## Not: Godot içinde denenmedi; yolları kendi projene göre ayarla.

const SRC := "res://wiki"
const DST := "user://wiki"
const VERSION_FILE := "user://wiki/.version"
const WIKI_VERSION := "1"   ## wiki'yi güncelledikçe artır, kopya yenilenir


static func open(page: String = "", anchor: String = "") -> void:
	if not _ensure_extracted():
		push_warning("Wiki kopyalanamadı")
		return
	var lang := TranslationServer.get_locale()   ## "tr", "en", "zh_CN" ... wiki ile aynı kodlar
	var url := "file:///%s/index.html?lang=%s" % [ProjectSettings.globalize_path(DST).trim_prefix("/"), lang]
	if page != "":
		url += "#/" + page + ("/" + anchor if anchor != "" else "")
	OS.shell_open(url)


static func _ensure_extracted() -> bool:
	if FileAccess.file_exists(VERSION_FILE) and FileAccess.get_file_as_string(VERSION_FILE) == WIKI_VERSION:
		return true
	return _copy_dir(SRC, DST) and _write_version()


static func _write_version() -> bool:
	var f := FileAccess.open(VERSION_FILE, FileAccess.WRITE)
	if f == null:
		return false
	f.store_string(WIKI_VERSION)
	return true


static func _copy_dir(from: String, to: String) -> bool:
	DirAccess.make_dir_recursive_absolute(to)
	var d := DirAccess.open(from)
	if d == null:
		return false
	for sub in d.get_directories():
		if not _copy_dir(from + "/" + sub, to + "/" + sub):
			return false
	for file in d.get_files():
		if file.ends_with(".import") or file.ends_with(".uid"):
			continue
		var data := FileAccess.get_file_as_bytes(from + "/" + file)
		var out := FileAccess.open(to + "/" + file, FileAccess.WRITE)
		if out == null:
			return false
		out.store_buffer(data)
	return true
