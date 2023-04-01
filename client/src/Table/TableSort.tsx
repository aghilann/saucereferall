import { useState } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  useMantineTheme,
  Avatar,
  Badge,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from '@tabler/icons-react';
import { baseURL } from '../constants';
import { useQuery } from 'react-query';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
}));

const jobColors: Record<string, string> = {
  engineer: 'blue',
  manager: 'cyan',
  designer: 'pink',
  product: 'teal',
  marketing: 'orange',
  sales: 'red',
  finance: 'yellow',
  hr: 'green',
  operations: 'violet',
  legal: 'indigo',
};

interface RowData {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  avatar: string;
}

interface TableSortProps {
  data: RowData[];
  jobTitle: string;
  company: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

const getMentors = async (jobTitle: string, company: string) => {
  const url = new URL(`${baseURL}/api/mentors`);
  if (company) url.searchParams.append('jobTitle', jobTitle);
  console.log(url.toString());
  // if (company) url.searchParams.append('company', company);
  const response = await fetch(url.toString());
  console.log(url.toString());
  return response.json();
};

export function TableSort() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [sortedData, setSortedData] = useState<RowData[]>([]);
  const theme = useMantineTheme();
  const { isLoading, isError, data } = useQuery('mentorss', () =>
    getMentors('', '')
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  if (data && !sortedData.length) {
    setSortedData(data);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData.map((row) => (
    <tr key={row.email}>
      <td>
        <Group spacing="sm">
          <Avatar size={30} src={row.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {row.name}
          </Text>
        </Group>
      </td>
      <td>
        <Badge
          color={jobColors[row.jobTitle.toLowerCase()] ?? 'green'}
          variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
        >
          {row.jobTitle}
        </Badge>
      </td>
      <td>{row.email}</td>
      <td>{row.company}</td>
    </tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        sx={{ tableLayout: 'fixed' }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'jobTitle'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('jobTitle')}
            >
              Role
            </Th>
            <Th
              sorted={sortBy === 'email'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('email')}
            >
              Email
            </Th>
            <Th
              sorted={sortBy === 'company'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('company')}
            >
              Company
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
