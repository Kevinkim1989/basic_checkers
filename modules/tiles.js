export class Tile {
    constructor(tile){
        this.key = tile.key;
        this.x = 1;
        this.y = 1;
        this.row_key = tile.row_key;
        this.column_key = tile.column_key;
        this.row = tile.row;
        this.column = tile.column;
        // this.is_path = false; // that a piece can be placed on.
        this.has_piece = false;

        this.is_path = this.checkIsPath(this.row_key, this.column_key);
        this.color = (this.is_path) ? 'black' : 'red';
        
        this.x = this.row_key * 60;
        this.y = this.column_key * 60;
    }

    // drawTile(canvas_id, tile){
    //     const canvas = document.getElementById(canvas_id);
    //     const ctx = canvas.getContext("2d");
    //     ctx.fillStyle = tile.is_path ? "black" : "white";
    //     ctx.fillRect(tile.x, tile.y, this.board.tile_size, this.board.tile_size);
    //   }

    checkIsPath(row_key, column_key){
        if (row_key % 2) {
            if (column_key % 2) {
                return false;
            } else {
                return true
            }
        } else {
            if (column_key % 2){
                return true;
            } else {
                return false;
            }
        }
    };
    // initTiles(){
    //     let tile_key = 0;
    //     for (let i = 0; i < this.board.rows.length; i++) {

    //         for (let k = 0; k < this.board.columns.length; k++) {
    //             let tile = new Tile(this.board);
    //             tile.key = tile_key;
    //             tile.x = i * this.board.tile_size;
    //             tile.row_name = this.board.rows[i];
    //             tile.column_name = this.board.columns[k]; 
    //             tile.row_key = this.board.rows.indexOf(this.board.rows[i]);
    //             tile.column_key = this.board.columns.indexOf(this.board.columns[k]); 
    //             tile.y = k * this.board.tile_size;

    //         if (i % 2) { // odd row
    //             tile.is_path = ((k % 2) == 0) // odd columns are playable tiles
    //         } else { // even row
    //             tile.is_path = ((k % 2) !== 0 ) // even columns 
    //         }

    //         this.board.tiles.push(tile);
    //         tile_key++;
    //     }
    // }
    // };

}
