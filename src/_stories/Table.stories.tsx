/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Text } from 'components';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components';

export default {
  title: 'Components/Table',
  component: Table,
};

const tasks = {
  headers: ['Category', 'Name', 'Issued', 'Expires'],
  content: [
    {
      value: [
        'Certificates',
        'International Tonnage',
        '01/31/2019',
        '02/01/2020',
      ],
      flag: 0,
    },
    {
      value: [
        'Certificates',
        'International Tonnage',
        '01/31/2019',
        '02/01/2020',
      ],
      flag: 1,
    },
    {
      value: [
        'Certificates',
        'International Tonnage',
        '01/31/2019',
        '02/01/2020',
      ],
      flag: 1,
    },
    {
      value: [
        'Certificates',
        'International Tonnage',
        '01/31/2019',
        '02/01/2020',
      ],
      flag: 2,
    },
    {
      value: [
        'Certificates',
        'International Tonnage',
        '01/31/2019',
        '02/01/2020',
      ],
      flag: 0,
    },
    {
      value: [
        'Certificates',
        'International Tonnage',
        '01/31/2019',
        '02/01/2020',
      ],
      flag: 0,
    },
    {
      value: [
        'Certificates',
        'International Tonnage',
        '01/31/2019',
        '02/01/2020',
      ],
      flag: 0,
    },
  ],
};

export const Default = () => (
  <div css={{ height: '100vh', width: '100vw' }}>
    <Table>
      <TableHead>
        <TableRow>
          {tasks.headers.map(task => (
            <TableHeader>{task}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.content.map(row => (
          <TableRow fontSize="sm" flag={row.flag}>
            {row.value.map(cell => (
              <TableCell>
                <Text>{cell}</Text>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
