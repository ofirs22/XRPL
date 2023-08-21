import React from 'react';
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    WhatsappShareButton,
    WhatsappIcon
} from 'react-share';

const SocialNetworkShare = ({description}) => {
    const currentPageUrl = window.location.href;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h3 style={{ color: 'white', marginBottom: '20px' }}> Share Your Victory</h3>

            <div style={{ display: 'flex', justifyContent: 'center' }}>

                <WhatsappShareButton
                    title={`I Solved The ${description} Minigame In XRPL Learning Lab.`}
                    url={currentPageUrl}
                    separator={' '}
                    style={{ margin: '0 10px' }}
                >
                    <WhatsappIcon size={40} round={true} />
                </WhatsappShareButton>

                <TwitterShareButton
                    title={`I Solved The ${description} Minigame In XRPL Learning Lab.`}
                    url={currentPageUrl}
                    hashtags={["developer", "blockchain", "solidity", "web3", "education", "games"]}
                    style={{ margin: '0 10px' }}
                >
                    <TwitterIcon size={40} round={true} />
                </TwitterShareButton>

                <LinkedinShareButton
                    title={`I Solved The ${description} Minigame In XRPL Learning Lab.`}
                    summary={`I Solved The ${description} Minigame In XRPL Learning Lab.`}
                    url={currentPageUrl}
                    source={'XRPL Learning Lab'}
                    style={{ margin: '0 10px' }}
                >
                    <LinkedinIcon size={40} round={true} />
                </LinkedinShareButton>

                <FacebookShareButton
                    quote={`I Solved The ${description} Minigame In XRPL Learning Lab.`}
                    url={currentPageUrl}
                    hashtag={'#blockchain'}
                    style={{ margin: '0 10px' }}
                >
                    <FacebookIcon size={40} round={true} />
                </FacebookShareButton>
            </div>
        </div>
    );
};

export default SocialNetworkShare;