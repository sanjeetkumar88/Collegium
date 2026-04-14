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
import * as projectApi from "../../../api/project";

const JoinRequestModal = ({ opened, onClose, projectId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await projectApi.getJoinRequests(projectId);
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
      const res = await projectApi.handleJoinRequest(projectId, { userId, action });
      alert(res.data.message || `${action} successful`);
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error(`Failed to ${action} join request`, err);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Join Requests" size="lg" centered>
      {loading ? (
        <Group position="center">
          <Loader />
        </Group>
      ) : !requests || requests.length === 0 ? (
        <Text align="center">No pending join requests.</Text>
      ) : (
        requests.map(({ user, role }, idx) => (
          <Group key={idx} position="apart" mt="md" className="border-b pb-2 last:border-b-0">
            <Group>
              <Avatar src={user?.avatar} radius="xl" />
              <div>
                <Text weight={500}>{user?.fullName}</Text>
                <Text size="sm" color="dimmed">
                  @{user?.username}
                </Text>
              </div>
              {role && (
                <Badge variant="light" color="blue">
                  {role}
                </Badge>
              )}
            </Group>
            <Group>
              <Button
                color="green"
                size="xs"
                onClick={() => handleAction(user?._id, "approve")}
              >
                Approve
              </Button>
              <Button
                color="red"
                size="xs"
                onClick={() => handleAction(user?._id, "reject")}
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
