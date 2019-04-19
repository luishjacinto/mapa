/*
Mapa:
    largura:
    altura:
    buscarPosicao()
    inutilizarArea()
    areasInutilizadas()
    adicionarStand()
    alocarStand()
    realocarStand()
    verificarTerreno()
    reduzirTerreno()

Stand:
    id:
    x:
    y:
    largura:
    altura:
    inserirStand()
    moverStand()
    addView()
    girarStand()
    aumentarLargura()
    aumentarAltura()
    reduzirLargura()
    reduzirAltura()
    
    criarMapa() -- Puxa mapa do banco *implementar banco
    criarStand() -- Adiciona um stand ao banco
    iniciarPosicoes() -- Chamado apos a criação do mapa para permitir as funções do mesmo 
        *verificar ser a pessoa logada é adm
    preencherCasas() -- Preenche a tabela com o stand 
        *mudar, apenas 1 numero aparecendo por stand
    busca() -- Faz uma busca especifica no mapa
    resetarMenus(); -- reseta todos menus e botoes de funções do mapa


*/

//AJAX BUSCA AREAS, AREAS INUTILIZADAS E STANDS
//done: mapa = new Mapa(); -> mapa.areasInutilizadas(areas); -> mapa.alocarStands(stands);
//setarMapa-ajax
// MAPA
// AREAS INUTILIZADAS DO MAPA
// STANDS
function Mapa(largura, altura) {
    //AO MAPA SER CRIADO ELE DEVE SER PREENCHIDO POR 2 AJAX

    this.largura = largura;
    this.altura = altura;

    this.tables = [];
    for (y = 0; y < altura; y++) {
        this.tables[y] = [];
        for (x = 0; x < largura; x++) {
            this.tables[y][x] = "0";
        }
    }

    this.buscarPosicao = function (x, y) {
        //buscarStand-ajax
        return this.tables[y - 1][x - 1];
    }

    this.disponibilizarArea = function (x, y) {
        this.tables[y - 1][x - 1] = "0";
        //jogar x y num json
        //disponibilizarArea-ajax
        preencherCasas(y, x, "");
        resetarMenus();
    }

    this.inutilizarArea = function (x, y) {
        this.tables[y - 1][x - 1] = "X";
        //jogar x y num json
        //inutilizarArea-ajax
        preencherCasas(y, x, "0");
        resetarMenus();
    }

    //converter para JSON
    //RECEBE UM VETOR VINDO DA TABELA DO BANCO CONTENDO AS AREAS INUTILIZADAS DO MAPA
    this.areasInutilizadas = function (areas) {
        for (aux = 0; aux < areas.length; aux++) {
            this.tables[areas[aux][1] - 1][areas[aux][0] - 1] = "X";
        }
    }

    //CRIA UM OBJETO STAND E ADD NA PRIMEIRA POSIÇÃO VAGA NO MAPA
    this.adicionarStand = function (stand) {
        this.tables[stand.y - 1][stand.x - 1] = stand.id + "";
        y = stand.y;
        x = stand.x;
        preencherCasas(y, x, stand.id);
    }

    //RECEBER VETOR AJAX STANDS CONTENDO ID,X,Y,ALTURA E LARGURA
    this.alocarStands = function (stands) {
        for (aux = 0; aux < stands.length; aux++) {
            for (y = stands[aux].y - 1; y < (stands[aux].y - 1) + stands[aux].altura; y++) {
                for (x = stands[aux].x - 1; x < (stands[aux].x - 1) + stands[aux].largura; x++) {
                    this.tables[y][x] = stands[aux].id + "";
                    preencherCasas(y + 1, x + 1, stands[aux].id);                    
                    $("#stand-"+stands[aux].id).remove();

                    divs = $("#stands").html();
                    divs += '<div id="stand-'+stands[aux].id+'" class="standView">'+stands[aux].id+'</div>';

                    $("#stands").html(divs);

                    $("#stand-"+stands[aux].id).css('top', ((stands[aux].y - 1) * 40) + ((stands[aux].y - 1) * 2) + 8);
                    $("#stand-"+stands[aux].id).css('left', ((stands[aux].x - 1) * 40) + ((stands[aux].x - 1) * 2) + 8);
                    $("#stand-"+stands[aux].id).css('height', ((stands[aux].altura) * 40) + ((stands[aux].altura) * 2)-6);
                    $("#stand-"+stands[aux].id).css('width', ((stands[aux].largura) * 40) + ((stands[aux].largura) * 2)-6);
                }
            }
        }
        //console.log(this.tables);
    }

    //AJAX que realocara o stand/ apagando o ele e o reescrevendo
    //apos realocar o objeto deve ter seus dados alterados e enviados por AJAX
    this.realocarStand = function (stand) {
        for (y = stand.y - 1; y < (stand.y - 1) + stand.alt; y++) {
            for (x = stand.x - 1; x < (stand.x - 1) + stand.larg; x++) {
                if (this.tables[y][x] == stand.id + "") {
                    preencherCasas(y + 1, x + 1, "");
                    this.tables[y][x] = "0";
                }
            }
        }
        //editarStand-ajax
        this.alocarStands([stand]);
    }


    //verifica se o espaço no mapa esta vago e se é possivel o stand ficar la, 
    //caso contrario sugere novo local(caso esteja movendo ele)
    //* FAZER verificarTerreno para MOVER e para GIRAR stand;
    //this.verificarTerreno = function (id, larguraInicial, alturaInicial, larguraFinal, alturaFinal) {
    this.verificarTerreno = function (id, xInicial, yInicial, largura, altura) {
        //                                   1          1        1        2
        no_error = true;
        if ((xInicial - 1) + largura <= this.largura && (yInicial - 1) + altura <= this.altura) {
            for (y = yInicial - 1; y < (yInicial - 1) + altura; y++) {
                for (x = xInicial - 1; x < (xInicial - 1) + largura; x++) {
                    //console.log(this.tables[y][x] == id + "" || this.tables[y][x] == '0');
                    if (this.tables[y][x] == id || this.tables[y][x] == '0') {} else {
                        no_error = false;
                    }
                }
            }
        } else {
            no_error = false;
        }
        return no_error;
    }

    this.reduzirTerreno = function (stand) {
        for (y = stand.y - 1; y < (stand.y - 1) + stand.alt; y++) {
            for (x = stand.x - 1; x < (stand.x - 1) + stand.larg; x++) {
                if (this.tables[y][x] == stand.id + "") {
                    //console.log(this.tables[y][x]);
                    preencherCasas(y + 1, x + 1, "");
                    this.tables[y][x] = "0";
                }
            }
        }
    }

}

//FUNÇÃO NOS BOTOES CRIARAM OS OBJETOS Stand E DPS EXECUTARAM SUAS FUNÇÕES
//EX: addStand(){  Stand = new Stand(mapa);    }
//AJAX VAI CRIAR ESSE OBJETO
function Stand(id) {
    //AJAX
    //else {
    //Stand DEFAULT (outro AJAX envia o novo stand para o banco)
    this.id = cod++;

    this.largura = 1;
    this.altura = 1;

    this.x = 1;
    this.y = 1;

    //}

    this.inserirStand = function (mapa) {
        posicao = [0, 0];
        for (y = 0; y < mapa.altura && posicao[0] == 0; y++) {
            for (x = 0; x < mapa.largura && posicao[0] == 0; x++) {
                if (mapa.tables[y][x] == "0") {
                    posicao = [x + 1, y + 1];
                }
            }
        }

        this.x = posicao[0];
        this.y = posicao[1];

        //Ajax
        //editaStand-ajax
        // x    y   largura    altura
        mapa.adicionarStand(this);
    }

    this.moverStand = function (xInicial, yInicial, mapa) {
        this.larg = this.largura;
        this.alt = this.altura;

        this.x = xInicial;
        this.y = yInicial;

        //funcao do mapa realizando a inversao de largura e altura
        if (mapa.verificarTerreno(this.id, xInicial, yInicial, this.alt, this.larg)) {
            //editaStand-ajax
        } else {
            console.log("Não foi possivel mover");
        }
    }


    this.addView = function (xInicial, yInicial, mapa) {
        this.larg = this.largura;
        this.alt = this.altura;

        no_error = true;
        $("#representante").css('display', 'inline');
        $("#representante").css('top', ((yInicial - 1) * 40) + ((yInicial - 1) * 2) + 8);
        $("#representante").css('left', ((xInicial - 1) * 40) + ((xInicial - 1) * 2) + 8);
        $("#representante").css('height', (this.altura) * 40);
        $("#representante").css('width', (this.largura) * 40);

        //console.log(mapa.verificarTerreno(this.id, xInicial, yInicial, this.alt, this.larg));
        if (mapa.verificarTerreno(this.id, xInicial, yInicial, this.largura, this.altura)) {
            $("#representante").css('display', 'inline-block');
            $("#representante").removeClass("posicaoInvalida");
            $("#representante").addClass("posicaoValida");
        } else {
            no_error = false;
            console.log("Não foi possivel mover");
            $("#representante").removeClass("posicaoValida");
            $("#representante").addClass("posicaoInvalida");
        }
        return no_error;
    }

    this.girarStand = function (mapa) {
        this.larg = this.largura;
        this.alt = this.altura;

        //funcao do mapa realizando a inversao de largura e altura
        if (mapa.verificarTerreno(this.id, this.x, this.y, this.alt, this.larg)) {
            this.largura = this.alt;
            this.altura = this.larg;
            console.log("Foi possivel girar");
            //AJAX que atualiza a largura e altura
            //editaStand-ajax
            mapa.realocarStand(this);
            this.larg = this.largura;
            this.alt = this.altura;
            resetarMenus();
        } else {
            console.log("Não foi possivel girar");
        }
    }

    this.aumentarLargura = function (mapa) {
        this.larg = this.largura;
        this.alt = this.altura;

        if (mapa.verificarTerreno(this.id, this.x, this.y, this.largura + 1, this.altura)) {
            this.largura++;

            //editaStand-ajax
            mapa.realocarStand(this);
            resetarMenus();
        } else {
            console.log("Não foi possivel aumentar a Largura");
        }

    }

    this.aumentarAltura = function (mapa) {
        this.larg = this.largura;
        this.alt = this.altura;

        if (mapa.verificarTerreno(this.id, this.x, this.y, this.largura, this.altura + 1)) {
            this.altura++;

            //editaStand-ajax
            mapa.realocarStand(this);
            resetarMenus();
        } else {
            console.log("Não foi possivel aumentar a Altura");
        }

    }

    this.reduzirLargura = function (mapa) {
        this.larg = this.largura;
        this.alt = this.altura;
        if (this.largura > 1) {
            mapa.reduzirTerreno(this);
            this.largura--;
            //editaStand-ajax
            mapa.realocarStand(this);
            resetarMenus();
        } else {
        }
    }

    this.reduzirAltura = function (mapa) {
        this.larg = this.largura;
        this.alt = this.altura;
        if (this.altura > 1) {
            mapa.reduzirTerreno(this);
            this.altura--;
            //editaStand-ajax
            mapa.realocarStand(this);
            resetarMenus();
        } else {
        }
    }

}
/////criar visual

function criarMapa(largura, altura) {
    k = new Mapa(largura, altura);

    mapaHtml = "";
    valor = "";
    for (y = 0; y < altura; y++) {
        mapaHtml += "<tr class='y-" + (y + 1) + "'>";
        for (x = 0; x < largura; x++) {
            if (k.tables[y][x] == 0) {
                valor = ""
            } else {
                valor = k.tables[y][x];
            }
            mapaHtml += "<th class='x-" + (x + 1) + "'>" + valor + "</th>"
        }
        mapaHtml += "</tr>";
    }

    $("#mapa").html(mapaHtml);
    iniciarPosicoes();
}

function resetarMenus() {
    pX = 0;
    pY = 0;
    clickIniciado = 0;
    standCheck = 0;
    standAtual = 0;
    $('#standMenu').css('display', 'none');
    $('#areaLivreMenu').css('display', 'none');
    $('#representante').css('display', 'none');
    $('#girarStandBtn').attr("onclick", '');
    $('#aLargBtn').attr("onclick", '');
    $('#aAltBtn').attr("onclick", '');
    $('#rLargBtn').attr("onclick", '');
    $('#rAltBtn').attr("onclick", '');
    $('#indArea').html("Indisponibilizar Area");
    $('#indArea').attr("onclick", '');
}

criarMapa(10,10);

function criarStand() {
    //AJAX P COLOCAR O NOVO STAND NO BANDO E PUXAR O ID DELE
    //criarStand-ajax
    //id
    stand = new Stand(cod);

    stand.inserirStand(k);
    console.log(stand);


    stand = "";
}

function preencherCasas(y, x, id) {
    $(".y-" + y).find(".x-" + x).html(id);
    if(id == "0"){
        $(".y-" + y).find(".x-" + x).addClass('areaIndisponivel');
    }else{
        $(".y-" + y).find(".x-" + x).removeClass('areaIndisponivel');
    }
}

function iniciarPosicoes() {
    //AJAX VERFICAR SE A PESSOA É ADM
    clickIniciado = 0;
    standCheck = 0;


    $("#mapa").find("th").mousedown(function (event) {
        resetarMenus();

        target = '';
        xAtual = '';
        yAtual = '';
        clickIniciado = 1;
        isDragging = false;

        pX = $(this).attr("class").split('-')[1].split(' ')[0];
        pY = $(this).parent().attr("class").split('-')[1].split(' ')[0];

        if ($(this).html() != "" && $(this).html() != "0"){
            standAtual = busca(pX, pY);
            standCheck = 1;
        }else{
            if ($(this).html() == "0"){
                standCheck = 2;
            }else{
                standCheck = 0;
            }
        }
    }).mousemove(function (event) {
        isDragging = true;
        if (clickIniciado == 1) {
            if (standCheck == 1) {
                if (event.target != target) {
                    target = event.target;
                    xAtual = $(this).attr("class").split('-')[1].split(' ')[0];
                    yAtual = $(this).parent().attr("class").split('-')[1].split(' ')[0];
                    //console.log(xAtual+' '+yAtual);
                    standAtual.addView(xAtual, yAtual, k);
                }
                target = event.target;
            }
        }
    }).mouseup(function (event) {
        wasDragging = isDragging;
        if (wasDragging == true) {
            clickIniciado = 0;
            if (standCheck == 1) {
                if (standAtual.addView(xAtual, yAtual, k) == true) {
                    k.reduzirTerreno(standAtual);
                    standAtual.moverStand(xAtual, yAtual, k)
                    k.realocarStand(standAtual);
                }
                $("#representante").css('display', 'none');
            }
        } else {
            $('#standMenu').css('display', 'none');
            $('#areaLivreMenu').css('display', 'none');
            if (standCheck == 1) {
                //stand  
                X = event.pageX;
                Y = event.pageY;  
                $('#standMenu').css('top', Y + 'px');
                $('#standMenu').css('left', X + 'px');
                $('#standMenu').css('display', 'block');
                
                //botoes
                $('#girarStandBtn').attr("onclick", 'busca(pX,pY).girarStand(k)');
                $('#aLargBtn').attr("onclick", 'busca(pX,pY).aumentarLargura(k)');
                $('#aAltBtn').attr("onclick", 'busca(pX,pY).aumentarAltura(k)');
                $('#rLargBtn').attr("onclick", 'busca(pX,pY).reduzirLargura(k)');
                $('#rAltBtn').attr("onclick", 'busca(pX,pY).reduzirAltura(k)');
            } else if (standCheck == 2) {
                //area inutilizada
                X = event.pageX;
                Y = event.pageY;
                $('#areaLivreMenu').css('top', Y + 'px');
                $('#areaLivreMenu').css('left', X + 'px');
                $('#areaLivreMenu').css('display', 'block');
                //botao
                $('#indArea').html('Disponibilizar Area');
                $('#indArea').attr("onclick", 'k.disponibilizarArea(pX,pY)');
            } else {
                //Area disponivel
                X = event.pageX;
                Y = event.pageY;
                $('#areaLivreMenu').css('top', Y + 'px');
                $('#areaLivreMenu').css('left', X + 'px');
                $('#areaLivreMenu').css('display', 'block');
                $('#indArea').attr("onclick", 'k.inutilizarArea(pX,pY)');
            }

        }
        standCheck = 0;
        clickIniciado = 0;
        standAtual = 0;
    });


    $('#dadosStand').click(function () {
        resetarMenus();
    });
    $('#areaLivreMenu').click(function () {
        resetarMenus();
    });
}

function busca(x, y) {
    if (k.tables[y - 1][x - 1] != "0" && k.tables[y - 1][x - 1] != "X") {
        //deveria criar um stand com base no banco, mas usarei um vetor para testar
        return stands[parseInt(k.tables[y - 1][x - 1]) - 1];
    }
}

var cod = 1;

s1 = new Stand(cod);
s2 = new Stand(cod);
s3 = new Stand(cod);
s4 = new Stand(cod);
s5 = new Stand(cod);
s6 = new Stand(cod);
s7 = new Stand(cod);

s1.inserirStand(k);
s2.inserirStand(k);
s3.inserirStand(k);
s4.inserirStand(k);
s5.inserirStand(k);
s6.inserirStand(k);
s7.inserirStand(k);

stands = [s1, s2, s3, s4, s5, s6, s7];

k.alocarStands(stands);