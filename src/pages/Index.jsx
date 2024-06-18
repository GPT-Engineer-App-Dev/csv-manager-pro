import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";
import { CSVReader } from "react-papaparse";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleOnDrop = (data) => {
    const headers = data[0].meta.fields;
    const rows = data.map((row) => ({ id: uuidv4(), ...row.data }));
    setHeaders(headers);
    setData(rows);
  };

  const handleOnError = (err) => {
    console.error(err);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: "" }), { id: uuidv4() });
    setData([...data, newRow]);
  };

  const handleRemoveRow = (id) => {
    setData(data.filter((row) => row.id !== id));
  };

  const handleInputChange = (id, header, value) => {
    setData(data.map((row) => (row.id === id ? { ...row, [header]: value } : row)));
  };

  const handleDownload = () => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "edited_data.csv");
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">CSV Upload, Edit, and Download Tool</Text>
        <CSVReader onDrop={handleOnDrop} onError={handleOnError} addRemoveButton>
          <span>Drop CSV file here or click to upload.</span>
        </CSVReader>
        {data.length > 0 && (
          <>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {headers.map((header) => (
                    <Th key={header}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row) => (
                  <Tr key={row.id}>
                    {headers.map((header) => (
                      <Td key={header}>
                        <Input
                          value={row[header]}
                          onChange={(e) => handleInputChange(row.id, header, e.target.value)}
                        />
                      </Td>
                    ))}
                    <Td>
                      <IconButton
                        aria-label="Remove"
                        icon={<FaTrash />}
                        onClick={() => handleRemoveRow(row.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button leftIcon={<FaPlus />} onClick={handleAddRow}>
              Add Row
            </Button>
            <Button leftIcon={<FaDownload />} onClick={handleDownload}>
              Download CSV
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;