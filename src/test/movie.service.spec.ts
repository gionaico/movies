require("dotenv").config();
const { ServiceBroker, Errors } = require("moleculer");
const MoviesSchema = require("../services/movie.service");

describe("Test 'movie' service", () => {
  let broker = new ServiceBroker({ logger: false });
  let movieService = broker.createService(MoviesSchema);

  // Start the broker. It will also init the service
  beforeAll(() => broker.start());
  // Gracefully stop the broker after all tests
  afterAll(() => broker.stop());

  describe("Test 'movie.create' action", () => {
    const mockInsert = jest.fn((params) => Promise.resolve({}));

    it("should throw error movie already exist", async () => {
      const mockGetMovie = jest.fn().mockResolvedValueOnce({ title: "title" });
      try {
        movieService.getMovieByTitle = mockGetMovie;

        const entity = {
          username: "Prueba test",
          title: "title lmlmlmlm",
          synopsis: "synopsis of movie 1",
          release_date: new Date(),
        };
        // Call the action
        await broker.call("movie.create", entity);
      } catch (error) {
        expect(mockGetMovie).toBeCalledTimes(1);
        expect(error).toBeInstanceOf(Errors.MoleculerError);
      }
    });

    it("should throw error movi already exist", async () => {
      const mockGetMovie = jest.fn().mockResolvedValueOnce(undefined);
      movieService.getMovieByTitle = mockGetMovie;
      movieService.adapter.repository.insert = mockInsert;
      const entity = {
        username: "Prueba test",
        title: "title lmlmlmlm",
        synopsis: "synopsis of movie 1",
        release_date: new Date(),
      };
      // Call the action
      const result = await broker.call("movie.create", entity);
      expect(mockGetMovie).toBeCalledTimes(1);
      expect(mockInsert).toBeCalledTimes(1);
      expect(result).toEqual(entity);
    });
  });

  describe("Test 'movie.update' action", () => {
    const mockInsert = jest.fn((params) => Promise.resolve({}));

    it("should throw error movie NO exist", async () => {
      /* const mockGetMovie = jest.fn().mockResolvedValueOnce({ title: "title" }); */
      const mockGetMovieByTitle = jest.fn().mockResolvedValueOnce(undefined);
      try {
        // console.log({ movieService });
        movieService.getMovieByTitle = mockGetMovieByTitle;
        const params = {
          username: "gio",
          oldtitle: "Matrix",
          new_entity: {
            release_date: new Date("2001-01-01"),
            title: "Matrixx2",
          },
        };
        // Call the action
        await broker.call("movie.update", params);
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.MoleculerError);
        expect(mockGetMovieByTitle).toBeCalledTimes(1);
      }
    });

    it("should throw error movie because user is different to creator", async () => {
      /* const mockGetMovie = jest.fn().mockResolvedValueOnce({ title: "title" }); */
      const mockGetMovieByTitle = jest
        .fn()
        .mockResolvedValueOnce({ username: "lala" });
      try {
        // console.log({ movieService });
        movieService.getMovieByTitle = mockGetMovieByTitle;
        const params = {
          username: "gio",
          oldtitle: "Matrix",
          new_entity: {
            release_date: new Date("2001-01-01"),
            title: "Matrixx2",
          },
        };
        // Call the action
        await broker.call("movie.update", params);
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.MoleculerError);
        expect(mockGetMovieByTitle).toBeCalledTimes(1);
      }
    });

    it("should throw error movie because new entity does not have propeties", async () => {
      /* const mockGetMovie = jest.fn().mockResolvedValueOnce({ title: "title" }); */
      const mockGetMovieByTitle = jest
        .fn()
        .mockResolvedValueOnce({ username: "gio" });
      try {
        // console.log({ movieService });
        movieService.getMovieByTitle = mockGetMovieByTitle;
        const params = {
          username: "gio",
          oldtitle: "Matrix",
          new_entity: {},
        };
        // Call the action
        await broker.call("movie.update", params);
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.MoleculerError);
        expect(mockGetMovieByTitle).toBeCalledTimes(1);
      }
    });

    it("Success update entity", async () => {
      const mockQueryBuilder = jest.fn(() => ({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnValueOnce(true),
      }));
      const mockGetMovieByTitle = jest
        .fn()
        .mockResolvedValueOnce({ username: "gio" });
      // console.log({ movieService });
      movieService.getMovieByTitle = mockGetMovieByTitle;
      movieService.adapter.repository.createQueryBuilder = mockQueryBuilder;
      const params = {
        username: "gio",
        oldtitle: "Matrix",
        new_entity: {
          release_date: new Date("2001-01-01"),
          title: "Matrixx2",
        },
      };
      // Call the action
      await broker.call("movie.update", params);
      expect(mockGetMovieByTitle).toBeCalledTimes(1);
      // expect(mockQueryBuilder).toBeCalledTimes(1);
    });
  });
});
