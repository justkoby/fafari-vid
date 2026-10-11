import sys,glob
from PIL import Image
out,cols,*files=sys.argv[1:]
cols=int(cols)
ims=[Image.open(f) for f in files]
w,h=ims[0].size; k=min(1,540/w if cols<=3 else 270/w); tw,th=int(w*k),int(h*k)
rows=(len(ims)+cols-1)//cols
W=Image.new('RGB',(tw*cols,th*rows))
for i,im in enumerate(ims): W.paste(im.resize((tw,th)),((i%cols)*tw,(i//cols)*th))
W.save(out)
