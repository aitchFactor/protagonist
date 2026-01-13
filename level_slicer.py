from PIL import Image
from pathlib import Path
import sys, optparse
# Option parser copyright 2016, 2021 Damian Yerrick
def parse_argv(argv):
    parser = optparse.OptionParser()
    parser.add_option("-i", "--input", dest="infilename",
                      help="read from INFILE",
                      metavar="INFILE")
    
    (options, pos) = parser.parse_args(argv[1:])

    # Fill unfilled roles with positional arguments
    pos = iter(pos)
    try:
        options.infilename = options.infilename or next(pos)
    except StopIteration:
        parser.error("no input file.")
    # make sure no trailing arguments
    try:
        next(pos)
        parser.error("too many filenames")
    except StopIteration:
        pass
    return options

def save_sliced(image:Image, folder:Path, filename_stem:Path):
    screen_dimensions = (256, 192)
    width, height = image.size
    if not folder.exists():
        folder.mkdir()
    for i, x in enumerate(range(0, width, screen_dimensions[0])):
        for j, y in enumerate(range(0, height, screen_dimensions[1])):
            left = x
            top = y
            right = x + screen_dimensions[0]
            bottom = y + screen_dimensions[1]
            im = image.crop([left, top, right, bottom])
            with open (folder / (filename_stem + f'_{i},{j}' + '.png'), 'wb') as outfile:
                print (folder / (filename_stem + f'_{i},{j}' + '.png'))
                im.save(outfile)

def main(argv=None):
    folder = Path(__file__).parent

    opts = parse_argv(argv or sys.argv)
    infp = Path(opts.infilename)
    
    im:Image = Image.open(folder / infp)

    parent_name = infp.parent.stem
    out_folder = folder / "project/gfx/bg" / parent_name

    save_sliced(im, out_folder, parent_name + "_" + infp.stem)
    

if __name__ == ("__main__"):
    main()