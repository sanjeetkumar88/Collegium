import { Card, Image, Text, Badge, Button, Group, Flex } from '@mantine/core';
import { Navigate } from 'react-router-dom'; 
function ProjectCard({
  imageUrl,
  title,
  badgeText,
  description,
  buttonText,
  timestamp,
  onClick,
}) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={imageUrl}
          h={160}
          alt={title}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{title}</Text>
        <Badge color="pink">{badgeText}</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {description}
      </Text>

      <Flex justify="space-between" align="center" mt="md">
        <Button color="blue" radius="md" onClick={onClick}>
          {buttonText}
        </Button>
        <Text size="xs" c="dimmed">
          {timestamp}
        </Text>
      </Flex>
    </Card>
  );
}

export default ProjectCard;
