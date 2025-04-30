import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  Button,
  Group,
  Loader,
  Avatar,
  Badge,
} from "@mantine/core";
import axios from "axios";

const JoinRequestModal = ({ opened, onClose, projectId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`/devproject/${projectId}/getjoinrequest`);
      setRequests(res.data.data);
    } catch (err) {
      console.error("Error fetching join requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      setLoading(true);
      fetchRequests();
    }
  }, [opened]);

  const handleAction = async (userId, action) => {
    try {
      const res = await axios.post(
        `/devproject/${projectId}/joinrequests/${action}`,
        { userId,action }
      );
      alert(res.data.message || `${action} successful`);
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error(`Failed to ${action} join request`, err);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Join Requests" size="lg" centered>
      {loading ? (
        <Loader />
      ) : requests.length === 0 ? (
        <Text>No pending join requests.</Text>
      ) : (
        requests.map(({ user, role }, idx) => (
          <Group key={idx} position="apart" mt="md">
            <Group>
              <Avatar radius="xl" />
              <div>
                <Text weight={500}>{user.fullName}</Text>
                <Text size="sm" color="dimmed">
                  @{user.username}
                </Text>
              </div>
              <Badge variant="light" color="blue">
                {role}
              </Badge>
            </Group>
            <Group>
              <Button
                color="green"
                size="xs"
                onClick={() => handleAction(user._id, "approve")}
              >
                Approve
              </Button>
              <Button
                color="red"
                size="xs"
                onClick={() => handleAction(user._id, "reject")}
              >
                Reject
              </Button>
            </Group>
          </Group>
        ))
      )}
    </Modal>
  );
};

export default JoinRequestModal;
