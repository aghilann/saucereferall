import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { faker } from '@faker-js/faker';

interface IParams {
  jobTitle: string;
  name: string;
  email: string;
  company: string;
  avatar: string;
}

class Mentor {
  private static clientParams = { region: 'us-west-2' };
  public jobTitle: string;
  public name: string;
  public email: string;
  public company: string;
  public avatar: string;
  public dynamodb: DynamoDBClient;

  constructor({ jobTitle, name, email, company, avatar }: IParams) {
    this.jobTitle = jobTitle;
    this.name = name;
    this.email = email;
    this.company = company;
    this.avatar = avatar;
    this.dynamodb = new DynamoDBClient(Mentor.clientParams);
  }

  static get TABLE_NAME() {
    return 'Mentors';
  }

  static get PARTITION_KEY() {
    return 'jobTitle';
  }

  static get SORT_KEY() {
    return 'email';
  }

  async save() {
    const params = {
      TableName: Mentor.TABLE_NAME,
      Item: {
        [Mentor.PARTITION_KEY]: { S: this.jobTitle },
        [Mentor.SORT_KEY]: { S: this.email },
        name: { S: this.name },
        company: { S: this.company },
        avatar: { S: this.avatar },
      },
    };
    const command = new PutItemCommand(params);
    return this.dynamodb.send(command);
  }

  static async getAllMentors() {
    const params = {
      TableName: Mentor.TABLE_NAME,
    };

    const command = new ScanCommand(params);
    const dynamodb = new DynamoDBClient(Mentor.clientParams);
    const result = await dynamodb.send(command);

    const mentors = result.Items?.map((item) => {
      return {
        jobTitle: item[Mentor.PARTITION_KEY].S,
        email: item[Mentor.SORT_KEY].S,
        name: item.name.S,
        company: item.company.S,
        avatar: item.avatar.S,
      };
    });

    return mentors;
  }

  static async getMentorsByTitle(jobTitle: string, company: string = '') {
    const params = {
      TableName: Mentor.TABLE_NAME,
      KeyConditionExpression: `${Mentor.PARTITION_KEY} = :pk`,
      ExpressionAttributeValues: {
        ':pk': { S: jobTitle },
      },
    };

    // if (company) {
    //   params.KeyConditionExpression += ` AND ${Mentor.SORT_KEY} = :sk`;
    //   params.ExpressionAttributeValues[':sk'] = { S: company };
    // }

    const command = new QueryCommand(params);
    const dynamodb = new DynamoDBClient(Mentor.clientParams);
    const result = await dynamodb.send(command);
    const mentors = result.Items?.map((item) => {
      return {
        jobTitle: item[Mentor.PARTITION_KEY].S,
        email: item[Mentor.SORT_KEY].S,
        name: item.name.S,
        company: item.company.S,
        avatar: item.avatar.S,
      };
    });
    return mentors;
  }
}

export { Mentor };
