import React from 'react';
import { Drawer, Button, Placeholder } from 'rsuite';
import { Link } from 'react-router-dom';

const DefaultDrawer = (openWithHeader, setOpenWithHeader) => {
   
    return (
        <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
        <Drawer.Header>
          <Drawer.Title>Marketplace</Drawer.Title>
          <Drawer.Actions>
          <Button onClick={() => setOpenWithHeader(false)}>
              <Link to='/signup' style={{ color: 'white' }}>Sign Up</Link>
            </Button>
            <Button onClick={() => setOpenWithHeader(false)}>
                <Link to='/login' style={{ color: 'white' }}>Login</Link>
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <Placeholder.Paragraph />
        </Drawer.Body>
      </Drawer>
    );
}

export default DefaultDrawer;