import System.Environment
import System.Random

toNormalDist :: (Integral t, Fractional f, Floating f) => t -> t -> f -> f -> f
toNormalDist meanScore totalScore u v = nd * (fromIntegral totalScore) * 0.1 + fromIntegral meanScore where nd = sqrt (((-2) * (log u))) * (cos (2 * pi * v))

calc :: (Integral t) => t -> [t] -> [t]
calc precentage nums = map (\num -> truncate ((fromIntegral num) * (fromIntegral precentage) / (fromIntegral 100))) nums

randAlter :: (RandomGen g, Integral t) => g -> [(t, t)] -> [Int]
randAlter rdgen ([]) = []
randAlter rdgen ((it, total):itleft) = (round (min (toNormalDist it total (nSam :: Double) (nSam2 :: Double)) (fromIntegral total))):(randAlter nrdgen itleft)
  where
    (nSam, n1rdgen) = random rdgen
    (nSam2, nrdgen) = random n1rdgen

processInput :: Int -> IO ()
processInput precentage = do
  inp <- getLine
  let nums = [read numStr | numStr <- words inp ] :: [Int]
  let calcRes = zip (calc precentage nums) nums
  rdgen <- newStdGen
  let alteredRes = randAlter rdgen calcRes
  let res = unwords ( map show alteredRes )
  putStrLn res
  processInput precentage
  return ()

main = do
  args <- getArgs
  let precentage = read ( head args )
  if length args /= 1 then error "./calcScore precentage" else processInput precentage
