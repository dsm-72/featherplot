import { publish } from 'gh-pages';

publish(
    'build', // path to public directory
    {
        branch: 'gh-pages',
        // Update to point to your repository
        repo: 'https://github.com/dsm-72/featherplot-svelte.git',
        user: {
            name: 'dsm-72',
            email: 'dsm-72'
        },
        dotfiles: true
    },
    () => {
        console.log('Deploy Complete!');
    }
);