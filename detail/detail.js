import { getUser, signOut } from '../services/auth-service.js';
import { protectPage } from '../utils.js';
import createUser from '../components/User.js';
import { getProfile, getWord } from '../services/word-service.js';
import createSingleServing from '../components/singleServing.js';
import { saveWord } from '../services/wordsToProfiles.js';

// State
let user = null;
let word = [];
let profile = null;

// Action Handlers
async function handlePageLoad() {
    user = getUser();
    protectPage(user);

    profile = await getProfile(user.id);
    console.log('in detail.js profile: ', profile);

    word = await getWord(14);

    display();
}

async function handleSignOut() {
    signOut();
}

async function handleRemoveWord() {
    console.log('removes word');
}

async function handleAddWord(word_id) {
    console.log('adds word');
    const dataToUpdate = {
        word_id,
        profile_id: Number(profile.id)
    };

    await saveWord(dataToUpdate);
}

// Components 
const User = createUser(
    document.querySelector('#user'),
    { handleSignOut }
);

const SingleServing = createSingleServing(document.querySelector('.word-card'), 
    handleRemoveWord,
    handleAddWord,
);

function display() {
    User({ user });
    SingleServing(word, user);
}

handlePageLoad();
