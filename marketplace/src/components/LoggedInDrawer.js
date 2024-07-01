import React from 'react';
import { Drawer, Button, Placeholder } from 'rsuite';
import { Link } from 'react-router-dom';

const LoggedInDrawer = (openWithHeader, setOpenWithHeader) => {

    return (
        <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
        <Drawer.Header>
          <Drawer.Title>Marketplace</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => handleLogOut()} appearance="primary">
              Sign Out
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
        </Drawer.Body>
      </Drawer>
    );
}

export default LoggedInDrawer;