from PIL import Image
from pathlib import Path
import sys, optparse
def get_tile_type (rgba):
    match rgba:
        case (0, 128, 0, 255):
            return "#"
        case (0, 128, 128, 255):
            return "="
        case (128, 0, 0, 255):
            return "^"
        case (128, 96, 0, 255):
            return "o"
        case _:
            return " "


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

def read_level(image:Image, folder:Path, filename_stem:Path):
    screen_dimensions = (128, 96)
    width, height = image.size
    image = image.convert("RGBA")
    
    if not folder.exists():
        folder.mkdir()
    with open(folder / (filename_stem + '_tiles.txt'), 'w') as outfile:
        for j, y in enumerate(range(0, height, 8)):
            for i, x in enumerate(range(0, width, 8)):
                tile = get_tile_type(image.getpixel([x, y]))
                print ((tile), end = '')
                print (ord(tile), file = outfile)
            print ()

    with open(folder / (filename_stem + '_dim.txt'), 'w') as outfile:
        print (i + 1, file = outfile)
        print (j + 1, file = outfile)
        print ("width:", i + 1, "height:", j + 1)

def main(argv=None):
    folder = Path(__file__).parent.parent

    opts = parse_argv(argv or sys.argv)
    infp = Path(opts.infilename)
    
    im:Image = Image.open(folder / infp)

    parent_name = infp.parent.stem
    out_folder = folder / "project/gfx/bg" / parent_name

    read_level(im, out_folder, parent_name + "_" + infp.stem)
    

if __name__ == ("__main__"):
    main()