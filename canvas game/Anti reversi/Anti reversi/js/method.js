var game = {};//全局对象；
game.player1 = -1;
game.player2 = 1;
game.black = document.getElementsByTagName('img')[0];//获取棋子图片；
game.white = document.getElementsByTagName('img')[1];
game.canvas = document.getElementById('canvas');
game.board = game.canvas.getContext('2d');//棋盘对象；
game.pieces = [];//表示棋盘的数组；（包含0，1，-1）
game.tips = [];//提示可下的位置的数组（包含0，1）
game.whitecount = 2;//白子数目；
game.blackcount = 2;//黑子数目；
game.active = 1;//执棋者；先下黑子；
game.count = -1;//回合数；
game.history = [];//记录棋局历史；

function make2Darray(x, y) {
    var result = new Array(y);
    for (var i = 0; i < y; i++) {
        result[i] = new Array(x);
        result[i].fill(0);
    }
    return result;
}
//10*10无需检测边界；
game.tips = make2Darray(10, 10);//提示矩阵；
game.pieces = make2Darray(10, 10);//棋盘矩阵；
game.pieces[4][4] = game.pieces[5][5] = -1;//-1是白子；
game.pieces[4][5] = game.pieces[5][4] = 1;//1是黑子；

//绘图函数：
function drawboard() {//画出棋盘；
    game.board.fillStyle = '#cc6633';
    game.board.fillRect(0, 0, 500, 500);
    for (var i = 1; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            game.board.fillStyle = '#EECFA1';
            game.board.fillRect(i * 50 + 2, j * 50 + 2, 46, 46);
        }
    }
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8];

    for (var i = 0; i < 8; i++) {
        game.board.fillStyle = '#FFB90F';
        game.board.font = '20px Arial';
        game.board.fillText(letters[i], 60 + 50 * i, 35);
    }
    for (var i = 0; i < 8; i++) {
        game.board.font = '20px Arial';
        game.board.fillText(numbers[i], 25, 75 + 50 * i);
    }
}
function drawpieces() {//画出棋子；
    for (var i = 1; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            if (game.pieces[j][i] == 0) {
                game.board.fillStyle = "#EECFA1";
                game.board.fillRect(i * 50 + 2, j * 50 + 2, 46, 46);
            } else if (game.pieces[j][i] == 1) {
                game.board.drawImage(game.black, i * 50 + 2, j * 50 + 2, 46, 46)
            } else {
                game.board.drawImage(game.white, i * 50 + 2, j * 50 + 2, 46, 46)
            }
        }
    }
};
function drawtips() {//画出提示矩阵；
    for (var i = 1; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            if (game.tips[j][i] == '1') {
                game.board.beginPath();
                game.board.arc(i * 50 + 25, j * 50 + 25, 10, 0, 2 * Math.PI);
                game.board.fillStyle = "#ff0";
                game.board.closePath();
                game.board.fill();
            }
        }
    }
};

//核心方法函数；
function judge_edge(x, y) {
    if (x < 1 || y < 1 || x >= 9 || y >= 9)
        return false;
    return true;
}

// 判断是否能落子
function is_ready(x, y) {
    // up_left 
    var up_left = core(-1, -1, x, y);
    // up 
    var up = core(-1, 0, x, y);
    // up_right
    var up_right = core(-1, 1, x, y);
    //  right
    var right = core(0, 1, x, y);
    // bottom_right
    var bottom_right = core(1, 1, x, y);
    // bottom
    var bottom = core(1, 0, x, y);
    // bottom_left
    var bottom_left = core(1, -1, x, y);
    // left
    var left = core(0, -1, x, y);
    if (up_left || up || up_right || right || bottom_right || bottom || bottom_left || left) {
        game.tips[x][y] = 1;//提示数组该点变为1；
        //   console.log(x,y);
    }
}

// 判断是否能落子的核心方法
function core(offset_x, offset_y, x, y) {
    var arr = game.pieces;//传入当前数组；
    var result = true;
    temp_x = x; temp_y = y;
    role_1 = false; role_2 = false;
    index = 0;
    temp_x += offset_x; temp_y += offset_y;
    while (judge_edge(temp_x, temp_y) && arr[temp_x][temp_y] != 0)//传入当前下子者颜色；
    {
        if (index == 0) {
            if (arr[temp_x][temp_y] == game.active)
                break;
        }
        if (arr[temp_x][temp_y] == game.player1)
            role_1 = true;
        else if (arr[temp_x][temp_y] == game.player2)
            role_2 = true;
        index++;
        temp_x += offset_x; temp_y += offset_y;
    }
    result = role_1 && role_2;
    return result;
}
//重置提示数组函数；
function reset_tips() {
    game.tips = make2Darray(10, 10);
    for (var x = 1; x < 9; x++) {
        for (var y = 1; y < 9; y++) {
            if (game.pieces[x][y] == 0) {
                is_ready(x, y);
            }
        }
    }
}

function checkandchangepieces(matrix, x, y) {//吃子函数；
    var result = matrix;
    //……;
    function checkandchangedown(matrix, x, y) {//下方检查与改变；
        for (var i = 1; i < 10 - y; i++) {
            if (result[y + i][x] == result[y][x]) {
                for (var n = y + 1; n < y + i; n++) {
                    if (result[n][x] != result[y][x]) {
                        result[n][x] = result[y][x];
                    } else {
                        break;
                    }
                }
            } else if (result[y + i][x] == 0) {
                break;
            }
        }
    }
    function checkandchangeup(matrix, x, y) {//上方检查与改变；
        for (var i = 1; i < y; i++) {
            if (result[y - i][x] == result[y][x]) {
                for (var n = y - 1; n > y - i; n--) {
                    if (result[n][x] != result[y][x]) {
                        result[n][x] = result[y][x];
                    } else {
                        break;
                    }
                }
            } else if (result[y - i][x] == 0) {
                break;
            }
        }
    }
    function checkandchangeright(matrix, x, y) {//右方检查与改变；
        for (var i = 1; i <= 10 - x; i++) {
            if (result[y][x + i] == result[y][x]) {
                for (var n = x + 1; n < x + i; n++) {
                    if (result[y][n] != result[y][x]) {
                        result[y][n] = result[y][x];
                    } else {
                        break;
                    }

                }
            } else if (result[y][x + i] == 0) {
                break;
            }
        }
    }

    function checkandchangeleft(matrix, x, y) {//左方检查与改变；
        for (var i = 1; i < x; i++) {
            if (result[y][x - i] == result[y][x]) {
                for (var n = x - 1; n > x - i; n--) {
                    if (result[y][n] != result[y][x]) {
                        result[y][n] = result[y][x];
                    } else {
                        break;
                    }
                }
            } else if (result[y][x - i] == 0) {
                break;
            }
        }
    }

    function checkandchangedown_right(matrix, x, y) {
        for (var i = 1, j = 1; i < 10 - x && j < 10 - y; i++ , j++) {
            if (result[y + j][x + i] == result[y][x]) {
                for (var m = x + 1, n = y + 1; m < x + i && n < y + j; m++ , n++) {
                    if (result[n][m] != result[y][x]) {
                        result[n][m] = result[y][x];
                    } else {
                        break;
                    }

                }
            } else if (result[y + j][x + i] == 0) {
                break;
            }
        }
    }
    function checkandchangeup_right(matrix, x, y) {
        for (var i = 1, j = 1; i < 10 - x && j < y; i++ , j++) {
            if (result[y - j][x + i] == result[y][x]) {
                for (var m = x + 1, n = y - 1; m < x + i && n > y - j; m++ , n--) {
                    if (result[n][m] != result[y][x]) {
                        result[n][m] = result[y][x];
                    } else {
                        break;
                    }

                }
            } else if (result[y - j][x + i] == 0) {
                break;
            }
        }
    }

    function checkandchangedown_left(matrix, x, y) {
        for (var i = 1, j = 1; i < x && j < 10 - y; i++ , j++) {
            if (result[y + j][x - i] == result[y][x]) {
                for (var m = x - 1, n = y + 1; m > x - i && n < y + j; m-- , n++) {
                    if (result[n][m] != result[y][x]) {
                        result[n][m] = result[y][x];
                    } else {
                        break;
                    }

                }
            } else if (result[y + j][x - i] == 0) {
                break;
            }
        }
    }

    function checkandchangeup_left(matrix, x, y) {
        for (var i = 1, j = 1; i < x && j < y; i++ , j++) {
            if (result[y - j][x - i] == result[y][x]) {
                for (var m = x - 1, n = y - 1; m > x - i && n > y - j; m-- , n--) {
                    if (result[n][m] != result[y][x]) {
                        result[n][m] = result[y][x];
                    } else {
                        break;
                    }
                }
            } else if (result[y - j][x - i] == 0) {
                break;
            }
        }
    }
    checkandchangedown(matrix, x, y);
    checkandchangeup(matrix, x, y);
    checkandchangeleft(matrix, x, y);
    checkandchangeright(matrix, x, y);
    checkandchangedown_left(matrix, x, y);
    checkandchangedown_right(matrix, x, y);
    checkandchangeup_left(matrix, x, y);
    checkandchangeup_right(matrix, x, y);
    return result//返回改变后的棋盘矩阵；
}

function matrixsum(matrix) {//矩阵求和函数
    var sum = 0;
    for (var i = 1; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            sum = sum + matrix[i][j];
        }
    }
    return sum;
}
//计算黑白子数目；
function changecount() {
    game.whitecount = game.blackcount = 0;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (game.pieces[i][j] == 1) {
                game.blackcount++;
            } else if (game.pieces[i][j] == -1) {
                game.whitecount++;
            }
        }
    }
}
//
function showrecord() {
    if (game.active == 1) {
        document.getElementById('player').innerHTML = '黑子';
    } else {
        document.getElementById('player').innerHTML = '白子';
    }
    document.getElementById('blackcount').innerHTML = ':' + game.blackcount;
    document.getElementById('whitecount').innerHTML = ':' + game.whitecount;
    document.getElementById('round').innerHTML = '第' + game.count + '回合';
}
//悔棋函数；
var m = [];
var n = 0;
function regret() {
    if (game.count >= 1) {
        game.count--;
        game.active = -game.active;
        game.history.pop();
        m[n] = game.history[game.history.length - 1];
        game.pieces = make2Darray(10, 10);
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                game.pieces[i][j] = m[n][i][j];
            }
        }
        n++;
        drawboard();
        drawpieces();
        reset_tips();
        drawtips();
        console.log('回合数是' + game.count);
        console.log('history长度是' + game.history.length);
    } else {
        alert('你想悔到宇宙大爆炸吗？')
    }
    changecount();
    showrecord();
}
//记录历史步骤函数；
var arr = [];
var t = 0;
function recordgame() {
    arr[t] = make2Darray(10, 10);
    console.log(arr[t]);
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            arr[t][i][j] = game.pieces[i][j];
        }
    }

    game.history.push(arr[t]);
    console.log(game.history);
    t++;
}
//主函数部分
drawboard();
document.getElementById('btn').onclick = function () {
    regret();
};
//点击开始游戏：
document.getElementById('start').onclick = function () {
    if (game.count == -1) {
        drawpieces();
        reset_tips();
        drawtips();
        recordgame();
        console.log(game.history);
        game.count++;
        changecount();
        showrecord();
    }

}

//落子后变化棋盘：
game.canvas.onclick = function (e) {
    var x = Math.floor((e.pageX - game.canvas.getBoundingClientRect().left) / 50);
    var y = Math.floor((e.pageY - game.canvas.getBoundingClientRect().top) / 50);
    while (game.pieces[y][x] == 0 && game.tips[y][x] == 1) {
        game.pieces[y][x] = game.active;
        game.pieces = checkandchangepieces(game.pieces, x, y);
        game.active = -game.active;
        drawboard();
        drawpieces();
        reset_tips();
        drawtips();
        changecount();
        console.log(game.pieces);
        game.count++;
        recordgame();
        showrecord();
        //判断胜负；
        if (matrixsum(game.tips) == 0) {
            if (matrixsum(game.pieces) > 0) {
                document.getElementById('victory').innerHTML = "黑方胜!";
            } else if (matrixsum(game.pieces) < 0) {
                document.getElementById('victory').innerHTML = "白方胜!";
            } else {
                document.getElementById('victory').innerHTML = "和棋!";
            }

        }

        // console.log('回合数是' + game.count);
        // console.log('history长度是' + game.history.length);
        // console.log(game.history);

    }

}