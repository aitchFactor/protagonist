# Includes
%include inflator/cmath

# Macro constants
%define PI_YAY 3.14159265358979323

# Assets
costumes "blank.svg";
sounds "meow.wav";

# Datatypes
struct Vec2 {
	x, y
}

# Macro functions
%define Vec2(x, y) (Vec2{x: x, y: y})

# Functions

# Procedures
proc main {
	Vec2 v = Vec2(1, 2);
	log v.x & ", " & v.y;
	log PI_YAY & " is cool!";
}

# Execution
onflag {
	main;
}