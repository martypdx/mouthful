export default function createBulkBin(root) {

    return ({ words }) => {

        root.innerHTML = '';
    
        for (const word of words) {
            const li = WordCard(word);
            root.append(li);
        }
    };
}

function WordCard(word) {

    const li = document.createElement('li');
    li.classList.add('word-card');

    const a = document.createElement('a');
    a.href = `../detail/?id=${word.id}`;

    const span = document.createElement('span');
    span.classList.add('word');
    span.textContent = word.word;


    a.append(span);

    li.append(a);

    return li;
}