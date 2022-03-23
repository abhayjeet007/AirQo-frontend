import React from 'react';
import Page from './Page';
import Hero from '../components/Hero';
import Monitor from '../components/Monitor';
import TopBar from '../components/nav/TopBar';
import GetApp from '../components/get-app/GetApp';
import MapSection from '../components/MapSection/MapSection';

const HomePage = () => (
    <Page>
        <div className="HomePage">
            <TopBar />
            <Hero />
            <Monitor />
            <MapSection />
            <GetApp />
        </div>
    </Page>
);

export default HomePage;
