import sys
tpl, net, live, out = sys.argv[1:5]
h = open(tpl, encoding="utf-8").read()
j = lambda p: open(p, encoding="utf-8").read().replace("</", "<\\/")
h = h.replace("__NET__", j(net)).replace("__LIVE__", j(live))
open(out, "w", encoding="utf-8").write(h)
print(len(h)//1024, "KiB")
