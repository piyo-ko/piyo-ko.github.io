function watermark(watermark_str, bg_color,
	font_size, font_family, font_color) {

	var canv = document.createElement('canvas');
	var contxt = canv.getContext('2d');
	var rot = -20/180 * Math.PI;

	canv.width = Math.round(font_size * watermark_str.length * Math.abs(Math.cos(-rot)) + font_size * Math.abs(Math.sin(-rot)));
	canv.height = Math.round(canv.width * Math.abs(Math.sin(-rot)) + font_size * Math.abs(Math.cos(-rot)));

	contxt.fillStyle = bg_color;
	contxt.fillRect(0, 0, canv.width, canv.height);

	contxt.font = font_size + "pt " + font_family;
	contxt.fillStyle = font_color;
	contxt.textAlign = 'left';
	contxt.textBaseline = 'top';
	contxt.translate(10, canv.height-40);
	contxt.rotate(rot);
	contxt.fillText(watermark_str, 0, 0);

	var img_src=canv.toDataURL();
	document.body.style.background = "url(" + img_src + ")";
}

function mark_draft(bg_color, font_color) {
	//watermark("!! DRAFT !!", bg_color, 36, "Monaco", font_color);
	//watermark("!! DRAFT !!", bg_color, 36, "Papyrus", font_color);
	watermark("!! DRAFT !!", bg_color, 36, "Helvetica", font_color);
}
