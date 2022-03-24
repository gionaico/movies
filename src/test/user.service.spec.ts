// import { ServiceBroker } from "moleculer";
// import * as AuthSchema from "../services/auth.service";
require("dotenv").config();
const { ServiceBroker, Errors } = require("moleculer");
const AuthSchema = require("../services/auth.service");
// const AuthSchema = require("../services/h.service");
import { TypeOrmDbAdapter } from "../config/adapter";

// const AuthSchema = require("../../services/users.service");

describe("Test 'auth' service", () => {
  let broker = new ServiceBroker({ logger: false });

  let authService = broker.createService(AuthSchema);

  // Start the broker. It will also init the service
  beforeAll(() => broker.start());
  // Gracefully stop the broker after all tests
  afterAll(() => broker.stop());

  describe("Test 'auth.register' action", () => {
    const mockInsert = jest.fn((params) => Promise.resolve({}));
    const mockBcryptHashSync = jest.fn(
      (password: string | Buffer, time: string | number) => password
    );
    it("should create new user", async () => {
      // Create a mock insert function
      const mockQueryBuilder = jest.fn(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockReturnValueOnce(undefined),
      }));
      /**
       * Replace with a mocks :
       *  - adapter.insert
       *  - bcrypt.hashSync
       *  - mockQueryBuilder
       */
      authService.adapter.repository.insert = mockInsert;
      authService.bcrypt.hashSync = mockBcryptHashSync;
      authService.adapter.connection.createQueryBuilder = mockQueryBuilder;

      const entity = {
        username: "Prueba test",
        password: "lmlmlmlm",
      };
      // Call the action
      const result = await broker.call("auth.register", entity);
      /* const result = await broker.call("helper.toUpperCase", { name: "name" }); */

      // Check the result
      expect(result).toEqual({ username: entity.username.toLowerCase() });
      // Check if mock was called
      expect(mockInsert).toBeCalledTimes(1);
      expect(mockBcryptHashSync).toBeCalledTimes(1);
      expect(mockQueryBuilder).toBeCalledTimes(1);
      expect(mockInsert).toBeCalledWith(entity);
    });

    it("should create throw error", async () => {
      const mockQueryBuilder = jest.fn(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockReturnValueOnce({ username: "username" }),
      }));
      try {
        const entity = {
          username: "Prueba test",
          password: "lmlmlmlm",
        };
        // Call the action
        await broker.call("auth.register", entity);
      } catch (error) {
        expect(mockQueryBuilder).toBeCalledTimes(1);
        expect(error).toBeInstanceOf(Errors.MoleculerError);
      }
    });
  });

  describe("Test 'auth.login' action", () => {
    const entity = {
      username: "Prueba test",
      password: "lmlmlmlm",
    };
    it("should throw a login error user no exist", async () => {
      const mockQueryBuilderNoData = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValueOnce(undefined),
      }));
      try {
        authService.adapter.repository.createQueryBuilder = mockQueryBuilderNoData;
        await broker.call("auth.login", entity);
      } catch (error) {
        expect(mockQueryBuilderNoData).toBeCalledTimes(1);
        expect(error).toBeInstanceOf(Errors.MoleculerError);
      }
    });

    it("should throw an error Incorrect password", async () => {
      const mockBcryptHashCompareSync = jest.fn(() => false);
      const mockQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValueOnce(entity),
      }));
      try {
        authService.adapter.repository.createQueryBuilder = mockQueryBuilder;
        authService.bcrypt.compareSync = mockBcryptHashCompareSync;
        await broker.call("auth.login", entity);
      } catch (error) {
        expect(mockQueryBuilder).toBeCalledTimes(1);
        expect(mockBcryptHashCompareSync).toBeCalledTimes(1);
        expect(error).toBeInstanceOf(Errors.MoleculerError);
      }
    });

    it("Check correct login", async () => {
      const mockQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValueOnce(entity),
      }));
      const mockBcryptHashCompareSync = jest.fn(() => true);
      const mockTransformEntity = jest.fn(() => true);
      authService.adapter.repository.createQueryBuilder = mockQueryBuilder;
      authService.bcrypt.compareSync = mockBcryptHashCompareSync;
      authService.transformEntity = mockTransformEntity;
      await broker.call("auth.login", entity);
      expect(mockQueryBuilder).toBeCalledTimes(1);
      expect(mockBcryptHashCompareSync).toBeCalledTimes(1);
      expect(mockTransformEntity).toBeCalledTimes(1);
    });
  });

  describe("Test 'auth.verify_token' action", () => {
    const paramToken = "token";
    it("Token valid", async () => {
      const mockJwtVerify = jest.fn().mockReturnValueOnce(paramToken);
      authService.jwt.verify = mockJwtVerify;
      const result = await broker.call("auth.verify_token", {
        token: paramToken,
      });
      expect(mockJwtVerify).toBeCalledTimes(1);
      expect(result).toBe(paramToken);
    });

    it("Invalid token", async () => {
      try {
        const result = await broker.call("auth.verify_token", {
          token: paramToken,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.MoleculerError);
      }
    });
  });
});
