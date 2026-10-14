import React from 'react';
import './notice.css';

const ProNotice = () => {
    return (
        <div className="atb-premium-notice">
            <div className="atb-premium-notice__content">
                <span className="atb-premium-badge">Premium</span>

                <div className="atb-premium-text">
                    <strong>Premium Theme Locked</strong>
                    <p>
                        This animation style is available in the Pro version.
                        Upgrade to unlock this beautiful design.
                    </p>
                </div>
            </div>

            <a
                href="https://bplugins.com/products/animated-text-block/pricing/"
                target="_blank"
                rel="noopener noreferrer"
                className="atb-premium-btn"
            >
                Upgrade to Pro 🚀
            </a>
        </div>
    )
};

export default ProNotice;