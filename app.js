import { getUser, signOut } from './services/auth-service.js';
import { getProfile, getWords } from './services/word-service.js';
import { targetAddWord } from './services/wordsToProfiles.js';
import { protectPage } from './utils.js';
import createUser from './components/User.js';
import createBulkBin from './components/BulkBin.js';
import { createNotification } from './components/notification.js';

// State
let user = null;
let profile = null;
let words = [];
let randomWords = [];

// Action Handlers
async function handlePageLoad() {
    user = getUser();
    if (protectPage(user)) return;

    // nice use of Promise.all 👍
    [profile, words] = await Promise.all([
        getProfile(user.id),
        // this method doesn't take any parameters
        getWords()
    ]);

    // AFAIK it's not directly exposed via the supabase sdk,
    // but in theory if there were a lot of words you wouldn't want
    // to select them all into the browser client, so there
    // is some sql magic to get a "random set" you would use.
    // Just be aware you wouldn't want to bring a ton of data to the
    // browser client just to get 4 rows
    for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * words.length);

        const [poppedItem] = words.splice(index, 1);

        randomWords.push(poppedItem);
    }

    targetAddWord(userActivity => {
        if (userActivity.profile_id === profile.id) return;
        createNotification(document.querySelector('.notifications-box'), userActivity);
        display();
    });

    display();
}

async function handleSignOut() {
    signOut();
}

// Components 
const User = createUser(
    document.querySelector('#user'),
    { handleSignOut }
);

const BulkBin = createBulkBin(document.querySelector('#bulk-bin-list'));

function display() {
    User({ profile });
    BulkBin({ words:randomWords });
}

handlePageLoad();
