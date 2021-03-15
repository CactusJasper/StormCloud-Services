function Cell(row, col, width)
{
    this.value = 0;
    this.x = col * width + 5 * (col+1);
    this.y = row * width + 5 * (row+1);
}

module.exports = Cell;