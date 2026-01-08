import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { UserList } from './UserList';
import React from 'react';

describe('UserList', () => {
  let mockSocket;
  let mockOnBack;
  let mockOnGameStart;

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      connected: true,
    };
    mockOnBack = vi.fn();
    mockOnGameStart = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderUserList = (props = {}) => {
    const defaultProps = {
      socket: mockSocket,
      currentUser: 'testUser',
      onBack: mockOnBack,
      onGameStart: mockOnGameStart,
    };
    return render(<UserList {...defaultProps} {...props} />);
  };

  test('renders "No users online." when no users are present', async () => {
    renderUserList();

    // Simulate socket emitting an empty user list
    await waitFor(() => {
      const usersListUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'users_list_update')[1];
      usersListUpdateHandler([]);
    });

    expect(screen.getByText('No users online.')).toBeInTheDocument();
    expect(mockSocket.emit).toHaveBeenCalledWith('get_users');
  });

  test('renders a list of users and challenge buttons', async () => {
    renderUserList();

    const users = [
      { socketId: 'user1', username: 'Alice' },
      { socketId: 'user2', username: 'Bob' },
    ];

    await waitFor(() => {
      const usersListUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'users_list_update')[1];
      usersListUpdateHandler(users);
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Challenge' })).toHaveLength(2);
  });

  test('sends a challenge when the challenge button is clicked', async () => {
    renderUserList();

    const users = [{ socketId: 'user1', username: 'Alice' }];

    await waitFor(() => {
      const usersListUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'users_list_update')[1];
      usersListUpdateHandler(users);
    });

    const challengeButton = screen.getByRole('button', { name: 'Challenge' });
    fireEvent.click(challengeButton);

    expect(mockSocket.emit).toHaveBeenCalledWith('send_challenge', { targetSocketId: 'user1' });
    expect(screen.getByText('Waiting...')).toBeInTheDocument();
  });

  test('displays a modal for an incoming challenge and accepts it', async () => {
    renderUserList();

    const challengeHandler = mockSocket.on.mock.calls.find(call => call[0] === 'challenge_received')[1];
    challengeHandler({ socketId: 'challengerId', username: 'Challenger' });

    await waitFor(() => {
      expect(screen.getByText('Challenge Received!')).toBeInTheDocument();
      expect(screen.getByText('Challenger wants to play with you.')).toBeInTheDocument();
    });

    const acceptButton = screen.getByRole('button', { name: 'ACCEPT' });
    fireEvent.click(acceptButton);

    expect(mockSocket.emit).toHaveBeenCalledWith('accept_challenge', { challengerId: 'challengerId' });
    expect(screen.queryByText('Challenge Received!')).not.toBeInTheDocument();
  });

  test('displays a modal for an incoming challenge and declines it', async () => {
    renderUserList();

    const challengeHandler = mockSocket.on.mock.calls.find(call => call[0] === 'challenge_received')[1];
    challengeHandler({ socketId: 'challengerId', username: 'Challenger' });

    await waitFor(() => {
      expect(screen.getByText('Challenge Received!')).toBeInTheDocument();
    });

    const declineButton = screen.getByRole('button', { name: 'DENY' });
    fireEvent.click(declineButton);

    expect(mockSocket.emit).not.toHaveBeenCalledWith('accept_challenge', expect.anything());
    expect(screen.queryByText('Challenge Received!')).not.toBeInTheDocument();
  });

  test('displays a modal when challenge is declined by opponent', async () => {
    renderUserList();

    // Simulate sending a challenge
    const users = [{ socketId: 'user1', username: 'Alice' }];
    await waitFor(() => {
        const usersListUpdateHandler = mockSocket.on.mock.calls.find(call => call[0] === 'users_list_update')[1];
        usersListUpdateHandler(users);
    });
    const challengeButton = screen.getByRole('button', { name: 'Challenge' });
    fireEvent.click(challengeButton);

    expect(screen.getByText('Waiting...')).toBeInTheDocument();

    // Simulate opponent declining
    const challengeDeclinedHandler = mockSocket.on.mock.calls.find(call => call[0] === 'challenge_declined')[1];
    challengeDeclinedHandler();

    await waitFor(() => {
      expect(screen.getByText('Challenge Update')).toBeInTheDocument();
      expect(screen.getByText('The challenge was refused or the user disconnected.')).toBeInTheDocument();
    });
  });

  test('calls onBack when "Back to Menu" button is clicked', () => {
    renderUserList();
    const backButton = screen.getByRole('button', { name: '← Back to Menu' });
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});

