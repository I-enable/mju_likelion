import express from "express";
import { General } from '../../models';
import { User } from '../../models';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { verifyToken } from "./middlewares";

const app = express();

// 로그인
app.post('/auth/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const loginCheck = await User.findAll({
    where: { email }
  });
  if (loginCheck.length === 0) {
    return res.json({
      error: "User not exist"
    });
  }
  
  else if (loginCheck[0]) {
    const same = bcrypt.compareSync(password, loginCheck[0].password);
    if (same) {
      const token = sign(
        {
          id: loginCheck[0].id,
          email: loginCheck[0].email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
          issuer: "developer"
        }
      );
      return res.json({
        code: 200,
        message: "토큰이 발급되었습니다. 단 10분",
        token,
      });

    
    }
    else {
      return res.json({
        error: "Passwords do not match"
      });
    }
  }
});


// 회원가입
app.post('/auth/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const loginCheck = await User.findAll({
    where: { email }
  });
  
  if (loginCheck.length === 1) {
    return res.json({
      error: "User already exist"
    });
  }
  // 단방향 암호화 후 DB추가
  let byPassword = await bcrypt.hash(password, 1);
  const newUser = await User.create({
    email: email,
    password: byPassword,
  });
  res.json({
    data: {
      user: {
        id: newUser.id,
      }
    }
  });
});

// 글 목록 조회 (완성)
app.get('/', async (req, res) => {
	const generalDatas = await General.findAll({});
  if (generalDatas.length === 0) {
    return res.json({
      data : []
    })
  }
	res.json({
		data: generalDatas
	});
});

// 글 개별 항목 조회(GET) (완료)
app.get('/:postId', async (req, res) => {  
    const { postId } = req.params;
    const generalDatas = await General.findAll({
      where: {
        id: postId
      }
    });
    if (generalDatas.length === 0) { // 없으면 에러
      return res.json({
        error: "Post not exist",
      });
    }
    res.json({
      data: generalDatas
    });
  });



// 글 생성(POST) (완료)
app.post('/', verifyToken, (req, res) => {
  const { content } = req.body;
  const writer = req.decode.id;
  General.create({
    content: content,
    writer: writer,
  });

  return res.json({
    data: {
      post: {
        id: writer
      }
    }
  })
});

// 특정 글 수정(PUT) (완료)
app.put('/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const writer = req.decode.id;

  const generalDatas = await General.findAll({
    where: {
      id: postId
    }
  });

  if (writer == generalDatas[0].writer) {
    General.update({
      content: content,
    }, {
      where: {id : postId}
    });
    return res.json({
      data: {
        id: postId
      }
    });
  }
  
  return res.json({
    error: "Cannot modify post"
  });
});

// 특정 글 삭제(DELETE) (완료)
app.delete('/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const writer = req.decode.id;

  const generalDatas = await General.findAll({
    where: {
      id: postId
    }
  });

  if (writer == generalDatas[0].writer) {
    General.destroy({
      where: {id : postId}
    });
    return res.json({
      data: "Successfully deleted"
    });
  }
  return res.json({
    error: "Cannot delete post"
  });
});

export default app;