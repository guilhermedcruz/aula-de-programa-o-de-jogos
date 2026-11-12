//DOM

const bola = document.querySelector('#caixa')

//Evento

document.addEventListener('keydown',animar)

//Função

function animar(evento){

    if(evento.key == 'ArrowUp'){

        bola.classList.add('bolaPular');
    }

    if(evento.key == 'ArrowDown'){

        bola.classList.remove('bolaPular');

    }


}