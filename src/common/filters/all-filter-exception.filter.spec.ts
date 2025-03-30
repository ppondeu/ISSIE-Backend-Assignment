import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { AllExceptionsFilter } from './all-filter-exception.filter';

describe('AllExceptionsFilter', () => {
  let exceptionFilter: AllExceptionsFilter;
  let responseMock: Response;
  let argumentsHostMock: ArgumentsHost;

  beforeEach(() => {
    exceptionFilter = new AllExceptionsFilter();
    responseMock = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
    argumentsHostMock = { switchToHttp: jest.fn().mockReturnValue({ getResponse: jest.fn().mockReturnValue(responseMock) }) } as unknown as ArgumentsHost;
  });

  it('should catch HttpException and format the response correctly', () => {
    const exception = new HttpException(
      { message: 'Forbidden', statusCode: 403, error: 'Forbidden' },
      HttpStatus.FORBIDDEN
    );

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      error: 'Forbidden',
      message: ['Forbidden'],
    });
  });

  it('should handle PrismaClientKnownRequestError (P2002)', () => {
    const exception = new PrismaClientKnownRequestError('Record already exists', {
      code: 'P2002',
      clientVersion: '2.0.0',
    });

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: ['A record with this field already exists.'],
    });
  });

  it('should handle PrismaClientKnownRequestError (P2003)', () => {
    const exception = new PrismaClientKnownRequestError('Foreign key constraint failed', {
      code: 'P2003',
      clientVersion: '2.0.0',
    });

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: ['Foreign key constraint failed.'],
    });
  });

  it('should handle PrismaClientKnownRequestError (P2005)', () => {
    const exception = new PrismaClientKnownRequestError('Invalid data format', {
      code: 'P2005',
      clientVersion: '2.0.0',
    });

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: ['Invalid data format.'],
    });
  });

  it('should handle PrismaClientKnownRequestError (P2025)', () => {
    const exception = new PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '2.0.0',
    });

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      error: 'Not Found',
      message: ['Record not found.'],
    });
  });

  it('should handle unknown PrismaClientKnownRequestError code and return 500 Internal Server Error', () => {
    const exception = new PrismaClientKnownRequestError('Unknown Prisma error', {
      code: 'P2006',
      clientVersion: '6.4.1',
    });

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal server error',
      message: ['Something went wrong'],
    });
  });

  it('should handle SyntaxError and return 400 Bad Request', () => {
    const exception = new SyntaxError('Unexpected token');

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: ['Unexpected token'],
    });
  });

  it('should handle generic Error and return 400 Bad Request', () => {
    const exception = new Error('Something went wrong');

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: ['Something went wrong'],
    });
  });

  it('should handle unknown exception type and return 500 Internal Server Error', () => {
    const exception = { someUnknownProperty: 'value' };

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal server error',
      message: ['Something went wrong'],
    });
  });
});
