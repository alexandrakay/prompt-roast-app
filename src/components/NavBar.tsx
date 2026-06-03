'use client';

import Link from 'next/link';
import { AppBar, Avatar, Box, Button, Skeleton, Toolbar, Typography } from '@mui/material';
import { useAuth } from '@/lib/useAuth';

export default function NavBar() {
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '52px !important', px: { xs: 2, sm: 4 } }}>
        <Typography
          component={Link}
          href="/"
          sx={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'text.primary',
            textDecoration: 'none',
          }}
        >
          Prompt Roast
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Button component={Link} href="/feed" size="small" color="inherit" sx={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}>
            Feed
          </Button>
          <Button component={Link} href="/cli" size="small" color="inherit" sx={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}>
            CLI
          </Button>
          {loading ? (
            <Skeleton variant="circular" width={28} height={28} />
          ) : user ? (
            <>
              <Button component={Link} href="/history" size="small" color="inherit" sx={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                History
              </Button>
              <Avatar
                src={user.photoURL ?? undefined}
                alt={user.displayName ?? 'User'}
                sx={{ width: 28, height: 28, fontSize: 12, ml: 0.5 }}
              >
                {user.displayName?.[0] ?? user.email?.[0] ?? 'U'}
              </Avatar>
              <Button size="small" color="inherit" onClick={signOut} sx={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                Sign out
              </Button>
            </>
          ) : (
            <Button variant="outlined" size="small" onClick={signIn} sx={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}>
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
