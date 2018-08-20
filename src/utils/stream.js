import { createTwitterClient, getCurrentUser } from '../utils/twitterClient';

function transformTweet(tweet) {
  let result = { ...tweet };

  if (tweet.retweeted_status) {
    result.retweeted_status.full_text = result.retweeted_status.text;
  }

  if (tweet.extended_tweet) {
    result = { ...result, ...result.extended_tweet };
  } else {
    result.full_text = result.text;
  }

  return result;
}

export async function homeTimelineStream(callback) {
  const [client, user] = await Promise.all([
    createTwitterClient(),
    getCurrentUser()
  ]);

  const friends = await client.getFrinendsIds({
    user_id: user.id_str,
    stringify_ids: true
  });

  const follow = [user.id_str, ...friends.ids];
  const params = {
    follow: follow.join(',')
  };

  client.filterStream(params, res => {
    if (
      res.in_reply_to_user_id_str !== null ||
      !follow.includes(res.user.id_str)
    ) {
      return;
    }

    const tweet = transformTweet(res);
    callback(tweet);
  });
}

export async function listStream(listId, callback) {
  const client = await createTwitterClient();
  const listsMembers = await client.getListsMembers({
    list_id: listId,
    count: 5000
  });

  const follow = listsMembers.users.map(user => user.id_str);
  const params = {
    follow: follow.join(',')
  };

  client.filterStream(params, res => {
    if (!follow.includes(res.user.id_str)) {
      return;
    }

    const tweet = transformTweet(res);
    callback(tweet);
  });
}

export async function mentionsStream(callback) {
  const [client, user] = await Promise.all([
    createTwitterClient(),
    getCurrentUser()
  ]);

  const params = {
    follow: user.id_str
  };

  client.filterStream(params, res => {
    if (res.in_reply_to_user_id_str !== user.id_str) {
      return;
    }

    const tweet = transformTweet(res);
    callback(tweet);
  });
}

export async function searchStream(query, callback) {
  const client = await createTwitterClient();

  const params = {
    track: query
  };

  client.filterStream(params, res => {
    if (res.retweeted_status || res.is_quote_status) {
      return;
    }

    const tweet = transformTweet(res);
    callback(tweet);
  });
}
