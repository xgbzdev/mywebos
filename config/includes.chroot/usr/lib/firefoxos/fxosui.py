"""Firefox OS 1.x style confirmation dialog: dark panel, big white text,
two equal buttons (gray Cancel, cyan OK)."""
import gi

gi.require_version("Gtk", "3.0")
from gi.repository import Gtk  # noqa: E402


def confirm(parent, message, ok="OK", cancel="Cancel", title=None, danger=False):
    dlg = Gtk.Dialog(transient_for=parent, modal=True)
    dlg.set_decorated(False)
    dlg.set_default_size(460, 260)
    dlg.set_position(Gtk.WindowPosition.CENTER_ON_PARENT if parent else Gtk.WindowPosition.CENTER)
    dlg.set_keep_above(True)
    dlg.get_style_context().add_class("fxos-dialog")
    area = dlg.get_content_area()
    area.set_spacing(0)
    for child in area.get_children():
        area.remove(child)
    body = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=14,
                   margin_start=26, margin_end=26, margin_top=24, margin_bottom=24)
    if title:
        t = Gtk.Label(label=title, xalign=0)
        t.get_style_context().add_class("fx-title")
        body.pack_start(t, False, False, 0)
        rule = Gtk.Box()
        rule.get_style_context().add_class("fx-rule")
        body.pack_start(rule, False, False, 0)
    msg = Gtk.Label(label=message, xalign=0, wrap=True, max_width_chars=40)
    msg.get_style_context().add_class("fx-msg")
    body.pack_start(msg, True, True, 0)
    area.pack_start(body, True, True, 0)
    row = Gtk.Box(spacing=14, homogeneous=True)
    row.get_style_context().add_class("fx-buttons")
    b_cancel = Gtk.Button(label=cancel)
    b_ok = Gtk.Button(label=ok)
    b_ok.get_style_context().add_class("destructive-action" if danger else "suggested-action")
    b_cancel.connect("clicked", lambda *_: dlg.response(Gtk.ResponseType.CANCEL))
    b_ok.connect("clicked", lambda *_: dlg.response(Gtk.ResponseType.OK))
    row.pack_start(b_cancel, True, True, 0)
    row.pack_start(b_ok, True, True, 0)
    area.pack_end(row, False, False, 0)
    dlg.show_all()
    b_ok.grab_focus()
    res = dlg.run()
    dlg.destroy()
    return res == Gtk.ResponseType.OK
